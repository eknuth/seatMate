lat: 45.499541
long: -122.613639

 SELECT "RTE","RTE_DESC","DIR_DESC",
 	distance(PointFromText('POINT(-122.613639 45.499541)', 4326), the_geom)
 		from tm_routes order by distance limit 10;
