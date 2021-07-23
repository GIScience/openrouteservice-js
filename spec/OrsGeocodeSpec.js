/* eslint-disable no-undef */
import OrsGeocode from '../src/OrsGeocode'
const orsGeocode = new OrsGeocode({ api_key: process.env.ORSKEY })

describe('Geocode Test', function() {
  it('Get results', function(done) {
    orsGeocode
      .geocode({
        text: 'Namibian Brewery',
        focus_point: [-20.45902199292039, 16.64960861206055],
        layers: [
          'country',
          'region',
          'macrocounty',
          'borough',
          'macroregion',
          'county',
          'neighbourhood',
          'borough',
          'street',
          'address',
          'coarse'
        ]
      })
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
        // eslint-disable-next-line no-console
        console.log(json)
        done.fail('Should not fail' + json)
      })
  })
})
