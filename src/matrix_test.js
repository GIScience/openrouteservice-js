const OrsMatrix = require('./OrsMatrix')

const Matrix = new OrsMatrix({
  api_key: '5b3ce3597851110001cf6248b03ee441340e480da73ff884be23d8b2'
})

Matrix.calculate({
  locations: [
    [8.690958, 49.404662],
    [8.687868, 49.390139],
    [8.687868, 49.390133]
  ],
  profile: 'driving-car',
  sources: ['all'],
  destinations: ['all'],
  host: 'http://129.206.5.136:8080/ors',
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', response)
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })
