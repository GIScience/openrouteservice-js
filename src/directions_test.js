const OrsDirections = require('./OrsDirections')

const Directions = new OrsDirections({
  api_key: '5b3ce3597851110001cf624858ff1f9270364f74907d578b80c3c41c'
})

Directions.calculate({
  coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
  profile: 'driving-car',
  extra_info: ['waytype', 'steepness'],
  geometry_format: 'encodedpolyline',
  format: 'json',
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', response)
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })
