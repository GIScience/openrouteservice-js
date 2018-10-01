# The JavaScript API to consume openrouteservice(s) painlessly!

[![Build Status](https://travis-ci.org/GIScience/openrouteservice-js.svg?branch=master)](https://travis-ci.org/GIScience/openrouteservice-js)

This library lets you consume the openrouteservice API in *JavaScript* applications. It allows you to painlessly consume the following services:

- Directions (routing)
- Geocoding (powered by Pelias)
- Isochrones (accessibilty)
- Time-distance matrix
- Pois (points of interest)

*Note:* In order to use this client, you have to register for a token at [openrouteservice](https://openrouteservice.org).


## Installation

Install the library with npm:

```npm install openrouteservice-js --save```


## Build the distribution file

```npm run bundleProduction```

This will be saved to `path/to/dist/ors-js-client.js`.

## Integrate the APIs in your application

You can either use our [bundled version](./dist/ors-js-client.js) which includes all APIs:

```javascript
<script src="dist/ors-js-client.js"></script>

<script>

  window.onload = function() {

    let orsDirections = new Openrouteservice.Directions({
      api_key: "XY"
    });

    orsDirections.calculate({
      coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
      profile: "driving-car",
      extra_info: ["waytype", "steepness"],
      geometry_format: "encodedpolyline",
      format: "json",
      mime_type: "application/json",
    })
      .then(function(json) {
          // Add your own result handling here
          console.log(JSON.stringify(json));
      })
      .catch(function(err) {
          console.error(err);
      });
  };

</script>
```

or you can use only the pieces you need, e.g. get directions

```javascript
const OrsDirections = require("./OrsDirections");

// add your api_key here
const Directions = new OrsDirections({
  api_key: "XY"
});

Directions.calculate({
  coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
  profile: "driving-car",
  extra_info: ["waytype", "steepness"],
  geometry_format: "encodedpolyline",
  format: "json",
  mime_type: "application/json"
})
  .then(function(json) {
    console.log(JSON.stringify(json));
  })
  .catch(function(err) {
    var str = "An error occured: " + err;
    console.log(str);
  });

```

Or use the geocoding services:


```javascript
const OrsGeocode = require("./OrsGeocode");

const Geocode = new OrsGeocode({
  api_key: "5b3ce3597851110001cf6248b03ee441340e480da73ff884be23d8b2"
});

Geocode.geocode({
  text: "Heidelberg",
  boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
  boundary_country: ["DE"],
  mime_type: "application/json"
})
  .then(function(response) {
    console.log("response", JSON.stringify(response));
  })
  .catch(function(err) {
    var str = "An error occured: " + err;
    console.log(str);
  });

Geocode.clear();

Geocode.reverseGeocode({
  point: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_country: ["DE"],
  mime_type: "application/json"
})
  .then(function(response) {
    console.log("response", JSON.stringify(response));
  })
  .catch(function(err) {
    var str = "An error occured: " + err;
    console.log(str);
  });

Geocode.clear();

Geocode.structuredGeocode({
  locality: "Heidelberg",
  mime_type: "application/json"
})
  .then(function(response) {
    console.log("response", JSON.stringify(response));
  })
  .catch(function(err) {
    var str = "An error occured: " + err;
    console.log(str);
  });
```

## Running Tests

You can run all tests via `npm test`. If you only want to run a single spec file, you can use the `--spec` option, e.g., `npm test --spec spec/OrsDirectionsSpec.js`.