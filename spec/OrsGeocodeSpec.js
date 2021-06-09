import OrsGeocode from '../src/OrsGeocode'
const orsGeocode = new OrsGeocode({ api_key: '5b3ce3597851110001cf62484c2b303725d843b5b765b5e83e8e3c30'})

describe('Geocode Test', function() {
  it('Get results', function(done) {
    orsGeocode
      .geocode({ text: "Namibian Brewery"})
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
        done.fail("Shouldn't fail" + json)
      })
  })
})
