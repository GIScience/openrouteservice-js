const OrsPois = require("./OrsPois");

const Pois = new OrsPois({
	api_key: "5b3ce3597851110001cf6248b03ee441340e480da73ff884be23d8b2"
});

Pois.pois({
	request: "pois",
	geometry: {
		bbox: [[8.8034, 53.0756], [8.7834, 53.0456]],
		geojson: {
			type: "Point",
			coordinates: [8.8034, 53.0756]
		},
		buffer: 100
	},
	mime_type: "application/json"
})
	.then(function(response) {
		console.log("response", JSON.stringify(response));
	})
	.catch(function(err) {
		var str = "An error occured: " + err;
		console.log(str);
	});
