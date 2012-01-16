var express = require('express'),
	app = express.createServer(),
  io = require('socket.io').listen(app),
  redis = require("redis"),
  jqtpl = require('jqtpl'),
  trimet = require('./lib/trimet.js');




app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('views', __dirname + '/views');
    app.set("view engine", "html");
    app.set("view options", {
        layout: false
    });
    app.register(".html", jqtpl.express);
    

});

app.configure('development', function(){
    app.use(express.static(__dirname + '/static'));
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    client = redis.createClient();
    speaker = redis.createClient();

});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/static', { maxAge: oneYear }));
  app.use(express.errorHandler());
  app.use(express.logger());
  client = redis.createClient(process.env.redis_port, process.env.redis_host);
  speaker = redis.createClient(process.env.redis_port, process.env.redis_host);
  client.auth(process.env.redis_password, redis.print);
  speaker.auth(process.env.redis_password, redis.print);
  

});


app.get('/', function(req, res) {
  console.log('getting /');
  client.lrange("bus:comment", 0, 14, function (err, data) {
    res.render('index.html', {'comments': JSON.stringify(data)});
  });

  
});


io.sockets.on('connection', function (socket) {
  // create a listener for this connection
  // this is a redis client that only subscribes to channels
  var listener = redis.createClient(process.env.redis_port, process.env.redis_host);
  listener.auth(process.env.redis_password, redis.print);
  
  socket.on('get-routes', function (lat, lon, cb) {
    if (typeof lat !== 'number' || typeof lat !== 'number') {
      cb('error: get-routes#invalid arguments');
    } else {
      trimet.getRouteByPoint(lat, lon, function(err, data) {
        cb(data);
      });
    }
  });

  socket.on('submit-comment', function (data) {
    socket.get('route-id', function (err, route_id) {
      console.log('published on ' + route_id);
      console.dir(data);
      client.lpush(route_id, JSON.stringify(
        {'ts': new Date().getTime(), 'text': data.comment}));
      speaker.publish(route_id, JSON.stringify({'ts': new Date().getTime(), 'text': data.comment}));
    });
  });

  socket.on('join-channel', function (route_id) {
    console.log('joining channel');
    listener.subscribe(route_id);
    socket.set('route-id', route_id, function () {
      console.log('joined ' + route_id);
    });
    // here are the events on the listener
    
  });
  listener.on("message", function (channel, data) {
    console.log('listener!');
    console.log('got a route comment on ' + channel);
    console.dir(data);
    io.sockets.emit('new-route-message', JSON.parse(data));
  });
  


});






app.listen(8000);
