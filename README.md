# The JavaScript API to consume openrouteservice(s) painlessly!

[![Build and test](https://github.com/GIScience/openrouteservice-js/actions/workflows/github-actions-build-and-test.yml/badge.svg)](https://github.com/GIScience/openrouteservice-js/actions/workflows/github-actions-build-and-test.yml)
[![codecov](https://codecov.io/gh/GIScience/openrouteservice-js/branch/main/graph/badge.svg?token=WCLd69Jqbp)](https://codecov.io/gh/GIScience/openrouteservice-js)

This library lets you consume the openrouteservice API in *JavaScript* applications. It allows you to painlessly consume the following services:

- Directions (routing)
- Geocoding | Reverse Geocoding | Structured Geocoding (powered by Pelias)
- Isochrones (accessibility)
- Time-distance matrix
- POIs (points of interest)
- Elevation (linestring or point)
- Optimization

See the examples in the [examples folder](examples)

*Note:* In order to use this client, you have to register for a token at [openrouteservice](https://openrouteservice.org). To understand the features of openrouteservice, please don't forget to read the docs. For visualization purposes on the map please use [openrouteservice maps](https://maps.openrouteservice.org).

## Documentation

This library uses the ORS API for request validation. To understand the input of each API specifically, please check [API Playground](https://openrouteservice.org/dev/#/api-docs) that provides an interactive documentation.

## Installation and Usage

Requirements

- git
- nodeJS
- *if not included in nodeJS:* npm

Install the library with npm:

```shell
npm install openrouteservice-js --save
```

### Use es module import
```js
import Openrouteservice from 'openrouteservice-js'
let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});
// ...
```

### Use requirejs
```js
const Openrouteservice = require("openrouteservice-js");
let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});
// ...
```

### Use the distribution file directly in html
```html
<script type="module" src="../openrouteservice-js/dist/ors-js-client.js"></script>
<script>
  let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});
  // ...
</script>
```

## Integrate the APIs in your application

### Isochrones Example (es module import)

```javascript
import Openrouteservice from "openrouteservice-js"

// Add your api_key here
const Isochrones = new Openrouteservice.Isochrones({ api_key: "XYZ"})

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
    console.log("response", response)
  })
  .catch(function(err) {
    const str = "An error occurred: " + err.status + " " + err
    console.log(str)
  })
```

### Directions HGV example (browser)
> Note: Nested parameters from the options object are easier accessible like  `restrictions`, `avoidables`
> and `avoid_polygons` (cf. [API docs](https://openrouteservice.org/dev/#/api-docs/v2/directions/{profile}/post)) 
```html
<script type="module" src="dist/ors-js-client.js"></script>

<script>
  window.onload = function() {
    // Add your api_key here
    let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});

    orsDirections.calculate({
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
      console.error(err);
    });
  };
</script>
```

### Geocode examples (require)

Or use the geocoding services:

```javascript
const Openrouteservice = require('openrouteservice-js')
// Add your api_key here
const Geocode = new Openrouteservice.Geocode({ api_key: "XYZ"})

Geocode.geocode({
  text: "Heidelberg",
  boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
  boundary_country: ["DE"]
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", JSON.stringify(response))
})
.catch(function(err) {
  const str = "An error occurred: " + err.status + " " + err
  console.log(str)
})


Geocode.reverseGeocode({
  point: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_country: ["DE"]
})
.then(function(response) {
  console.log("response", JSON.stringify(response));
})
.catch(function(err) {
  const str = "An error occurred: " + err.status + " " + err
  console.log(str);
})


Geocode.structuredGeocode({
  locality: "Heidelberg"
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", JSON.stringify(response))
})
.catch(function(err) {
  const str = "An error occurred: " + err.status + " " + err
  console.log(str)
})
```

### Matrix example
Calculate 
```javascript
// Add your api_key here
const Matrix = new Openrouteservice.Matrix({ api_key: "XYZ"})

Matrix.calculate({
  locations: [[8.690958, 49.404662], [8.687868, 49.390139], [8.687868, 49.390133]],
  profile: "driving-car",
  sources: ['all'],
  destinations: ['all']
})
.then(function(response) {
  // Add your own result handling here
  console.log("response", response)
})
.catch(function(err) {
  const str = "An error occurred: " + err.status + " " + err
  console.log(str)
})
```

### Elevation example
```js
// Add your api_key here
const Elevation = new Openrouteservice.Elevation({api_key: "XYZ"})

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
  console.log('response', JSON.stringify(response))
})
.catch(function(err) {
  const str = 'An error occurred: ' + err.status + " " + err
  console.log(str)
})
```
### Optimization example
Or consume Optimization API to solve [vehicle routing problems](https://en.wikipedia.org/wiki/Vehicle_routing_problem)

```javascript
var openrouteservice = require("openrouteservice-js");

// Add your api_key here
var Optimization = new openrouteservice.Optimization({api_key: "XYZ"});

Optimization.optimize({
  jobs: [
    {
      id: 1,
      service: 300,
      amount: [1],
      location: [2.03655, 48.61128],
      skills: [1]
    },
    {
      id: 2,
      service: 300,
      amount: [1],
      location: [2.03655, 48.61128],
      skills: [2]
    },
  ],
  vehicles: [
    {
      id: 1,
      profile: 'driving-car',
      start: [2.35044, 48.71764],
      end: [2.35044, 48.71764],
      capacity: [3],
      skills: [1, 2],
    }
  ],
})
.then(function(response) {
  // Add your own result handling here
  console.log('response', JSON.stringify(response));
})
.catch(function(err) {
  var str = 'An error occurred: ' + err.status + " " + err
  console.log(str)
});
```

## Development Setup

Clone the openrouteservice-js repository from GitHub into a development environment of your choice.

```shell
git clone https://github.com/GIScience/openrouteservice-js.git
cd openrouteservice-js

# Install the dependencies
npm install

# Make your openrouteservice API key available for tests, examples and dev_app
sh setup.sh <your-api-key>
```

Start the dev_app for debugging when working with source files:
```shell
# runs the app at http://localhost:5173
vite
```

Now you can either use the devtools of your browser to set breakpoints (e.g. in `OrsGeocode`)
or create a `JavaScript Debug` configuration to debug with WebStorm:
![debug_config](https://user-images.githubusercontent.com/23240110/195876234-4a0ad923-1c5c-4cfe-976a-d39dd23a50d8.png)

Run the config in debug mode to open the Chrome browser and reload the page after changes for them to take
effect immediately.

## Running Tests

To run specific unit test files in `src/__tests__` on demand during development, run
```shell
npm run test:e2e
```
Choose one of your installed browsers in the cypress UI you want to test in and select the test file you want to run.

Component tests for the web app can be run by switching to component testing.

To run tests without ui use the npm scripts ending with `:ci` e.g. for unit, component and e2e tests:
```shell
npm run test:ci
```
## Commits and versioning

- This app uses the `commitizen` plugin to generate standardized commit types/messages. After applying any change in a feature branch, use `git add .` and then `npm run commit` (instead of `git commit ...`)
- The plugin `standard-version` is used to generate changelog entries, version tag and to bump the app version in package.json.

Deployment flow:

- Apply the changes in a feature branch and test it locally
- Once the feature is ready, merge it to `develop`, deploy it to the testing environment
- Checkout in `main`, merge from develop and use `npm run release` to generate a release. This will generate a new release commit as well as a git tag and an entry in [CHANGELOG.md](CHANGELOG.md).

*For more details about `commitizen` and `standard-version` see [this article](https://medium.com/tunaiku-tech/automate-javascript-project-versioning-with-commitizen-and-standard-version-6a967afae7)*
