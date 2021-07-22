/* eslint-disable no-undef */
import OrsPois from '../src/OrsPois'

const orsPois = new OrsPois({ api_key: process.env.ORSKEY })

describe('POI Test', function() {
  it('Get results', function(done) {
    orsPois
      .pois({
        geometry: {
          bbox: [
            [8.8034, 53.0756],
            [8.7834, 53.0456]
          ],
          geojson:{
            type: 'Point',
            coordinates: [8.8034, 53.0756]
          },
          buffer: 250
        }
      })
      .then(function(json) {
        expect(json[0].features.length).toBeGreaterThan(2)
        expect(json[0].type).toEqual('FeatureCollection')
        expect(json[0].features[0].type).toEqual('Feature')
        expect(json[0].features[0].geometry.type).toEqual('Point')
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json)
      })
  })
})
