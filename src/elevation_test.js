const OrsElevation = require('./OrsElevation')

const Elevation = new OrsElevation({
  api_key: '5b3ce3597851110001cf624858ff1f9270364f74907d578b80c3c41c'
})

Elevation.lineElevation({
  format_in: 'geojson',
  format_out: 'geojson',
  geometry: {
    coordinates: [[13.349762, 38.11295], [12.638397, 37.645772]],
    type: 'LineString'
  },
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Elevation.clear()

Elevation.lineElevation({
  format_in: 'polyline',
  format_out: 'encodedpolyline',
  geometry: [[13.349762, 38.11295], [12.638397, 37.645772]],
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Elevation.clear()

Elevation.lineElevation({
  format_in: 'polyline',
  format_out: 'encodedpolyline',
  geometry: {
    coordinates: [[13.349762, 38.11295], [12.638397, 37.645772]],
    type: 'LineString'
  },
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Elevation.clear()

Elevation.lineElevation({
  format_in: 'encodedpolyline',
  format_out: 'encodedpolyline',
  geometry: 'u`rgFswjpAKD',
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Elevation.clear()

Elevation.pointElevation({
  format_in: 'geojson',
  format_out: 'geojson',
  geometry: {
    coordinates: [13.349762, 38.11295],
    type: 'Point'
  }
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Elevation.clear()

Elevation.pointElevation({
  format_in: 'point',
  format_out: 'geojson',
  geometry: [13.349762, 38.11295]
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })
