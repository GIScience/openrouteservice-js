/* eslint-disable no-undef */
import OrsGeocode from '../src/OrsGeocode'
const orsGeocode = new OrsGeocode({ api_key: process.env.ORSKEY })

describe('Geocode Test', function() {
  it('Get results', function(done) {
    orsGeocode
      .geocode({ text: 'Namibian Brewery' })
      .then(function(json) {
        expect(json.features.length).toEqual(10)
        expect(json.type).toEqual('FeatureCollection')
        expect(json.features[0].type).toEqual('Feature')
        expect(json.features[1].type).toEqual('Feature')
        expect(json.features[0].geometry.type).toEqual('Point')
        expect(json.features[1].geometry.type).toEqual('Point')
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json)
      })
  })
})
