/* eslint-disable no-undef */
import OrsIsochrones from '../src/OrsIsochrones'
const orsIsochrones = new OrsIsochrones({ api_key: process.env.ORSKEY })

describe('Isochrone Test', function() {
  it('Get results', function(done) {
    orsIsochrones
      .calculate({
        locations: [
          [8.690958, 49.404662],
          [8.687868, 49.390139]
        ],
        profile: 'driving-car',
        range: [600]
      })
      .then(function(json) {
        expect(json.features.length).toEqual(2)
        expect(json.type).toEqual('FeatureCollection')
        expect(json.features[0].type).toEqual('Feature')
        expect(json.features[1].type).toEqual('Feature')
        expect(json.features[0].geometry.type).toEqual('Polygon')
        expect(json.features[1].geometry.type).toEqual('Polygon')
        expect(json.features[0].properties.value).toEqual(600)
        expect(json.features[1].properties.value).toEqual(600)
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json)
      })
  })
})
