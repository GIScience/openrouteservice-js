const OrsIsochrones = require("./OrsIsochrones");

const Isochrones = new OrsIsochrones({
	api_key: "5b3ce3597851110001cf6248b03ee441340e480da73ff884be23d8b2"
});

Isochrones.calculate({
	locations: [[8.690958, 49.404662], [8.687868, 49.390139]],
	profile: "driving-car",
	range: 600,
	mime_type: "application/json"
})
	.then(function(response) {
		console.log("response", JSON.stringify(response));
	})
	.catch(function(err) {
		var str = "An error occured: " + err;
		console.log(str);
	});
