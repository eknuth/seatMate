var settings = require('./local_settings'),
  express = require('express'),
	app = express.createServer(),
  io = require('socket.io').listen(app),
  redis = require("redis"),
  client = redis.createClient(settings.port, settings.host),
  jqtpl = require('jqtpl');

client.auth(settings.password, redis.print);


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
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/static', { maxAge: oneYear }));
  app.use(express.errorHandler());
  app.use(express.logger());

});


app.get('/', function(req, res) {
  console.log('getting /');
  client.lrange("bus:comment", 0, 2, function (err, data) {
    res.render('index.html', {'comments': JSON.stringify(data)});
  });

  
});


io.sockets.on('connection', function (socket) {
  socket.on('submit-comment', function (data) {
    client.lpush("bus:comment", JSON.stringify(
                {'ts': new Date(), 'text': data.comment}));
  });
});






app.listen(8000);
