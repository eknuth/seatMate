var trimet = require('../lib/trimet.js'),
    should = require('should');

describe('trimet: get nearest routes from coordinate', function() {
    describe('getRoutesByPoint', function() {
        it('should return some points', function(done) {
            var lat = 45.499541,
                lon = -122.613639,
                expectedRoutes = [{
                    route: 9,
                    description: 'Powell/Broadway',
                    distance: 0.00200889736828729
                }, {
                    route: 14,
                    description: 'Hawthorne',
                    distance: 0.00229043846550735
                }, {
                    route: 71,
                    description: '60th Ave/122nd Ave',
                    distance: 0.00460586966268184
                }, {
                    route: 4,
                    description: 'Division/Fessenden',
                    distance: 0.00575370636240205
                }, {
                    route: 75,
                    description: 'Cesar E Chavez/Lombard',
                    distance: 0.00898150226029743
                }, {
                    route: 66,
                    description: 'Marquam Hill/Hollywood',
                    distance: 0.00898150861891694
                }, {
                    route: 17,
                    description: 'Holgate/NW 21st',
                    distance: 0.00924074516961275
                }, {
                    route: 10,
                    description: 'Harold St',
                    distance: 0.0148568363291083
                }, {
                    route: 15,
                    description: 'Belmont/NW 23rd',
                    distance: 0.0170180326549672
                }, {
                    route: 19,
                    description: 'Woodstock/Glisan',
                    distance: 0.020370095002805
                }];

                trimet.getRouteByPoint(lat, lon, function(err, data) {
                    should.not.exist(err);
                    should.exist(data);
                    data.should.eql(expectedRoutes);
                    done();
                });
                });
        });
    });