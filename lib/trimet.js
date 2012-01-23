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

exports.getRouteByID = function getRouteInfoByID (route_id, cb) {
	var query = 'select "RTE" as route, "RTE_DESC" as description, "DIR_DESC" as direction, "TYPE" as type, "FREQUENT" as frequent, st_asgeojson(the_geom) as geojson from tm_routes where gid=$1;';
	pg.connect(conString, function (err, client) {
		if (err) {
			console.dir(err);
            cb(err, null);
        } else {
			client.query(query, [route_id], function(err, data) {
				if (err) {
					console.dir(err);
					cb(err, null);
				} else {
					// only return one
					cb(null, data.rows[0]);
				}
			});
        }
	});
};

exports.getRouteByPoint = function getRouteByPoint (lat, lon, cb) {
	var query = 'SELECT "gid" as id, "RTE" as route, "RTE_DESC" as description,\n' +
				"min(distance(PointFromText('POINT(" + lon + " " + lat + ")', 4326), the_geom)) as distance\n" +
				"from tm_routes group by gid, route, description\n" +
				"order by distance limit 10;";
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