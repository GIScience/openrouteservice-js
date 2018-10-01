# The JavaScript API to consume openrouteservice(s) painlessly!

[![Build Status](https://travis-ci.org/GIScience/openrouteservice-js.svg?branch=master)](https://travis-ci.org/graphhopper/openrouteservice-js)

This library lets you consume the openrouteservice API in *JavaScript* applications.

In order to use this client, you have to register for a token at [openrputeservice](https://openrouteservice.org).


## Installation

Install the library with npm:

```npm install openrouteservice-js-api-client --save```


## Build the distribution file

```npm run bundleProduction```


## Integrate the APIs in your application

You can either use our [bundled version](./dist/ors-js-client.js), including all APIs...

```
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
            console.log(json);
          })
          .catch(function(err) {
            console.error(err);
          });
    };
</script>
```

or you can use only the pieces you need, e.g.

```
const OrsDirections = require("./OrsDirections");

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
  .then(function(response) {
    console.log("response", response);
  })
  .catch(function(err) {
    var str = "An error occured: " + err;
    console.log(str);
  });
```


## Running Tests

You can run all tests via `npm test`. 
If you only want to run a single spec file, you can use the `--spec` option, e.g., `npm test --spec spec/OrsDirectionsSpec.js`.



