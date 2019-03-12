const OrsIsochrones = require('./OrsIsochrones')

const Isochrones = new OrsIsochrones({
  api_key: '5b3ce3597851110001cf624858ff1f9270364f74907d578b80c3c41c'
})

Isochrones.calculate({
  locations: [[8.690958, 49.404662], [8.687868, 49.390139]],
  profile: 'driving-car',
  range: [600],
  units: 'km',
  range_type: 'distance',
  attributes: ['area'],
  host: 'http://129.206.5.136:8080/ors',
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
  area_units: 'km',
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })
