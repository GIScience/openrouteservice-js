/* eslint-disable no-undef */
import OrsPois from '../src/OrsPois'
import Constants from '../src/constants'

describe('No api key OrsPois Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsPois({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key OrsPois Test ' + error)
    }
  })
})

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
          geojson: {
            type: 'Point',
            coordinates: [8.8034, 53.0756]
          },
          buffer: 250
        }
      })
      .then(function(json) {
        expect(json).toBeInstanceOf(Array)
        expect(json.length).toBeGreaterThan(0)
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
