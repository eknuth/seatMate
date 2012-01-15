var pg = require('pg').native,
	conString = "tcp://" +
				process.env.PGUSER + ":" +
				process.env.PGPASSWORD + "@" +
				process.env.PGHOST + ":" +
				process.env.PGPORT + "/" +
				process.env.PGDATABASE;

// SELECT "RTE" as route, "RTE_DESC" as description,
// 	min(distance(PointFromText('POINT(-122.613639 45.499541)', 4326), the_geom)) as distance
// from tm_routes group by route, description
// order by distance limit 10;


exports.getRouteByPoint = function getRouteByPoint (lat, lon, cb) {
	var query = 'SELECT "RTE" as route, "RTE_DESC" as description,\n' +
				"min(distance(PointFromText('POINT(-122.613639 45.499541)', 4326), the_geom)) as distance\n" +
				"from tm_routes group by route, description\n" +
				"order by distance limit 10;";
	console.log(conString);
	pg.connect(conString, function (err, client) {
		if (err) {
			console.dir(err);
            cb(err, null);
        } else {
			client.query(query, function(err, data) {
				if (err) {
					console.dir(err);
					cb(err, null);
				} else {
					cb(null, data.rows);
				}
			});
        }
    });
};