# something like this, but not this exactly
ogr2ogr -t_srs EPSG:4326 -a_srs EPSG:4326 -f "ESRI Shapefile" output.shp input.shp
ogr2ogr -skipfailures -nlt POLYGON -f "ESRI Shapefile" pdx_hash_polygon PG:"host=localhost dbname=civicapps" pdx_hash_polygon

