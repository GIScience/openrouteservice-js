var OrsDirections = require("../src/OrsDirections");
var OrsInput = require("../src/OrsInput");
var orsDirections = new OrsDirections({
    api_key: "5b3ce3597851110001cf6248e506c10eb14646ae9ed90fa9e22a8f72"
});

describe("Simple Route", function() {
    it("Get results", function(done) {
        orsDirections.clearPoints();
        orsDirections.addWaypoint(new OrsInput("8.690958, 49.404663").coord);
        orsDirections.addWaypoint(new OrsInput("8.687868, 49.390139").coord);

        orsDirections
            .calculate({
                profile: "driving-car",
                geometry_format: "encodedpolyline",
                format: "json",
                mime_type: "application/json"
            })
            .then(function(json) {
                console.log(json.routes[0].summary);
                expect(json.routes.length).toBeGreaterThan(0);
                expect(json.routes[0].summary.distance).toBeGreaterThan(2300);
                expect(json.routes[0].summary.distance).toBeLessThan(2800);
                done();
            })
            .catch(function(err) {
                done.fail(err.message);
            });
    });

    it("Compare Fastest vs. Shortest", function(done) {
        orsDirections.clearPoints();
        orsDirections.addWaypoint(new OrsInput("8.690958, 49.404662").coord);
        orsDirections.addWaypoint(new OrsInput("8.687868, 49.390139").coord);

        orsDirections
            .calculate({
                profile: "driving-car",
                preference: "fastest",
                geometry_format: "encodedpolyline",
                format: "json",
                mime_type: "application/json"
            })
            .then(function(json) {
                var fastestTime = json.routes[0].summary.duration;
                var fastestDistance = json.routes[0].summary.distance;
                // Shortest is not prepared with CH
                orsDirections
                    .calculate({
                        profile: "driving-car",
                        preference: "shortest",
                        geometry_format: "encodedpolyline",
                        format: "json",
                        mime_type: "application/json"
                    })
                    .then(function(json2) {
                        expect(
                            json2.routes[0].summary.duration
                        ).toBeGreaterThan(fastestTime);
                        expect(json2.routes[0].summary.distance).toBeLessThan(
                            fastestDistance
                        );
                        done();
                    })
                    .catch(function(err) {
                        done.fail(err.message);
                    });
            })
            .catch(function(err) {
                done.fail(err.message);
            });
    });

});
