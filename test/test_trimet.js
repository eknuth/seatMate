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
                    direction: 'To Powell & 98th or Gresham TC',
                    distance: 0.00200889736828729
                }, {
                    route: 9,
                    description: 'Powell/Broadway',
                    direction: 'To Saratoga & 27th',
                    distance: 0.00200890251737265
                }, {
                    route: 14,
                    description: 'Hawthorne',
                    direction: 'To Foster & 94th',
                    distance: 0.00229043846550735
                }, {
                    route: 14,
                    description: 'Hawthorne',
                    direction: 'To Portland City Center',
                    distance: 0.00229044244641688
                }, {
                    route: 71,
                    description: '60th Ave/122nd Ave',
                    direction: 'To Foster & 94th',
                    distance: 0.00460586966268184
                }, {
                    route: 71,
                    description: '60th Ave/122nd Ave',
                    direction: 'To Clackamas Town Center',
                    distance: 0.00460588437600594
                }, {
                    route: 4,
                    description: 'Division/Fessenden',
                    direction: 'To Gresham TC',
                    distance: 0.00575370636240205
                }, {
                    route: 4,
                    description: 'Division/Fessenden',
                    direction: 'To St Johns',
                    distance: 0.00575370636240205
                }, {
                    route: 75,
                    description: 'Cesar E Chavez/Lombard',
                    direction: 'To St. Johns',
                    distance: 0.00898150226029743
                }, {
                    route: 75,
                    description: 'Cesar E Chavez/Lombard',
                    direction: 'To Milwaukie',
                    distance: 0.00898150543661629
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