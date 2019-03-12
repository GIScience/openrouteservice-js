const OrsGeocode = require('./OrsGeocode')

const Geocode = new OrsGeocode({
  api_key: '5b3ce3597851110001cf6248b03ee441340e480da73ff884be23d8b2'
})

Geocode.geocode({
  text: 'Heidelberg',
  boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
  boundary_country: ['DE'],
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Geocode.clear()

Geocode.reverseGeocode({
  point: { lat_lng: [49.412388, 8.681247], radius: 50 },
  boundary_country: ['DE'],
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })

Geocode.clear()

Geocode.structuredGeocode({
  locality: 'Heidelberg',
  mime_type: 'application/json'
})
  .then(function(response) {
    console.log('response', JSON.stringify(response))
  })
  .catch(function(err) {
    var str = 'An error occured: ' + err
    console.log(str)
  })
