var pg = require('pg').native,
	conString = "tcp://" + process.env.PGUSER + ":" + process.env.PGPASSWORD + "@" + process.env.PGHOST + ":" + process.env.PGPORT + "/" + process.env.PGDATABASE;

exports.getRouteByPoint = function getRouteByPoint (lat, lon, cb) {
	var query = 'SELECT "RTE" as route,"RTE_DESC" as description,"DIR_DESC" as direction,\n' +
				"distance(PointFromText('POINT(-122.613639 45.499541)', 4326), the_geom) as distance\n" +
				'from tm_routes order by distance limit 10;';
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