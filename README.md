# The JavaScript API to consume openrouteservice(s) painlessly!

[![Build and test](https://github.com/GIScience/openrouteservice-js/actions/workflows/github-actions-build-and-test.yml/badge.svg)](https://github.com/GIScience/openrouteservice-js/actions/workflows/github-actions-build-and-test.yml)

This library lets you consume the openrouteservice API in *JavaScript* applications. It allows you to painlessly consume the following services:

- Directions (routing)
- Geocoding | Reverse Geocoding | Structured Geocoding (powered by Pelias)
- Isochrones (accessibility)
- Time-distance matrix
- Pois (points of interest)
- Elevation (linestring or point)

See the examples in the [examples folder](examples)

*Note:* In order to use this client, you have to register for a token at [openrouteservice](https://openrouteservice.org). To understand the features of openrouteservice, please don't forget to read the docs. For visualization purposes on the map please use [openrouteservice maps](https://maps.openrouteservice.org).

## Documentation

This library uses the ORS API for request validation. To understand the input of each API specifically, please check [API Playground](https://openrouteservice.org/dev/#/api-docs) that provides an interactive documentation. This library supports the following services:

- Directions (routing)
- Geocoding | Reverse Geocoding | Structured Geocoding (powered by Pelias)
- Isochrones (accessibility)
- Time-distance matrix
- Pois (points of interest)
- Elevation (linestring or point)

## Installation

Install the library with npm:

```npm install openrouteservice-js --save```

## Or use the distribution file in your browser

```js
// Run this command if you need to build a new version
npm run browserBundleProduction
```

The bundled version will be saved to `openrouteservice-js/dist/ors-js-client.js`.

## Integrate the APIs in your application

### Example (browser)

You can either use our [bundled version](./dist/ors-js-client.js) which includes all APIs

```javascript
<script src="dist/ors-js-client.js"></script>

<script>
  window.onload = function() {
    // Add your api_key here
    let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});

    orsDirections.calculate({
      coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
      profile: "driving-car",
      extra_info: ["waytype", "steepness"],
      format: "json"
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

### Examples using the npm distribution

```javascript
const openrouteservice = require("openrouteservice-js");

// Add your api_key here
const Directions = new openrouteservice.Directions({ api_key: "XYZ");

Directions.calculate({
    coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
    profile: 'driving-hgv',
    restrictions: { height: 10, weight: 5 },
    extra_info: ['waytype', 'steepness'],
    avoidables: ['highways', 'tollways', 'ferries', 'fords'],
    avoid_polygons: {
      type: 'Polygon',
      coordinates: [
        [
          [8.683533668518066, 49.41987949639816],
          [8.680272102355957, 49.41812070066643],
          [8.683919906616211, 49.4132348262363],
          [8.689756393432617, 49.41806486484901],
          [8.683533668518066, 49.41987949639816]
        ]
      ]
    },
    format: 'json'
  })
  .then(function(json) {
    // Add your own result handling here
    console.log(JSON.stringify(json));
  })
  .catch(function(err) {
    const str = "An error occurred: " + err;
    console.log(str);
  });
```

Or use the geocoding services:

```javascript
const openrouteservice = require("openrouteservice-js");

// Add your api_key here
const Geocode = new openrouteservice.Geocode({ api_key: "XYZ"});

Geocode.geocode({
  text: "Heidelberg",
  boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
  boundary_country: ["DE"]
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", JSON.stringify(response));
})
.catch(function(err) {
  const str = "An error occurred: " + err;
  console.log(str);
});

Geocode.clear();

Geocode.reverseGeocode({
  point: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_country: ["DE"]
})
.then(function(response) {
  console.log("response", JSON.stringify(response));
})
.catch(function(err) {
  const str = "An error occurred: " + err;
  console.log(str);
});

Geocode.clear();

Geocode.structuredGeocode({
  locality: "Heidelberg"
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", JSON.stringify(response));
})
.catch(function(err) {
  const str = "An error occurred: " + err;
  console.log(str);
});
```

Query isochrones:

```javascript
const openrouteservice = require("openrouteservice-js");

// Add your api_key here
const Isochrones = new openrouteservice.Isochrones({ api_key: "XYZ"});

Isochrones.calculate({
    locations: [[8.690958, 49.404662], [8.687868, 49.390139]],
    profile: 'driving-car',
    range: [600],
    units: 'km',
    range_type: 'distance',
    attributes: ['area'],
    smoothing: 0.9,
    avoidables: ['highways'],
    avoid_polygons: {
      type: 'Polygon',
      coordinates: [
        [
          [8.683533668518066, 49.41987949639816],
          [8.680272102355957, 49.41812070066643],
          [8.683919906616211, 49.4132348262363],
          [8.689756393432617, 49.41806486484901],
          [8.683533668518066, 49.41987949639816]
        ]
      ]
    },
    area_units: 'km'
  })
  .then(function(response) {
    // Add your own result handling here
    console.log("response", response);
  })
  .catch(function(err) {
    const str = "An error occurred: " + err;
    console.log(str);
  });
```

Or fetch a time-distance matrix:

```javascript
const openrouteservice = require("openrouteservice-js");

// Add your api_key here
const Matrix = new openrouteservice.Matrix({ api_key: "XYZ"});

Matrix.calculate({
  locations: [[8.690958, 49.404662], [8.687868, 49.390139], [8.687868, 49.390133]],
  profile: "driving-car",
  sources: ['all'],
  destinations: ['all']
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", response);
})
.catch(function(err) {
  const str = "An error occurred: " + err;
  console.log(str);
});
```

Or return elevation data from a geojson line:

```javascript
const openrouteservice = require("openrouteservice-js");

// Add your api_key here
const Elevation = new openrouteservice.Elevation({api_key: "XYZ"});

Elevation.lineElevation({
  format_in: 'geojson',
  format_out: 'geojson',
  geometry: {
    coordinates: [[13.349762, 38.11295], [12.638397, 37.645772]],
    type: 'LineString'
  }
})
.then(function(response) {
  // Add your own result handling here
  console.log('response', JSON.stringify(response));
})
.catch(function(err) {
  const str = 'An error occurred: ' + err;
  console.log(str)
});
```

## Running Tests

In order to run the tests locally, it is necessary to create a `spec/test-env.js` by using/copying the `spec/test-env-template.js` and to set a valid ORS key in the just created file.

You can run all tests via `npm test`. If you only want to run a single spec file, you can use the `--spec` option, e.g., `npm test --spec spec/OrsDirectionsSpec.js`.

## Commits and versioning

- This app uses the `commitizen` plugin to generate standardized commit types/messages. After applying any change in a feature branch, use `git add .` and then `npm run commit` (instead of `git commit ...`)
- The plugin `standard-version` is used to generate changelog entries, version tag and to bump the app version in package.json.

Deployment flow:

- Apply the changes in a feature branch and test it locally
- Once the feature is ready, merge it to `develop`, deploy it to the testing environment
- Checkout in `master`, merge from develop and use `npm run release` to generate a release. This will generate a new release commit as well as a git tag and an entry in [CHANGELOG.md](CHANGELOG.md).

*For more details about `commitizen` and `standard-version` see [this article](https://medium.com/tunaiku-tech/automate-javascript-project-versioning-with-commitizen-and-standard-version-6a967afae7)*
