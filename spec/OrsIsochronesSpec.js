/* eslint-disable no-undef */
import OrsIsochrones from '../src/OrsIsochrones'
import Constants from '../src/constants'

describe('No api key Isochrones Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsIsochrones({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key Isochrones Test ' + error)
    }
  })
})

const orsIsochrones = new OrsIsochrones({ api_key: process.env.ORSKEY })

describe('Isochrone Test', function() {
  it('Get results', function(done) {
    orsIsochrones.addLocation([8.660958, 49.414662])
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
  it('Get results with custom host and service', function(done) {
    new OrsIsochrones({
      api_key: process.env.ORSKEY,
      host: Constants.defaultHost,
      service: 'isochrones'
    })
      .calculate({
        locations: [
          [8.690958, 49.404662],
          [8.687868, 49.390139]
        ],
        profile: 'cycling-regular',
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

  it('Get results with avoid polygon', function(done) {
    new OrsIsochrones({ api_key: process.env.ORSKEY })
      .calculate({
        locations: [
          [8.690958, 49.404662],
          [8.687868, 49.390139]
        ],
        profile: 'cycling-regular',
        range: [600],
        avoidables: ['ferries', 'fords'],
        avoid_polygons: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [8.68716, 49.400494],
                [8.69099, 49.400976],
                [8.690336, 49.399454],
                [8.68716, 49.400494]
              ]
            ]
          ]
        }
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
        done.fail('Should not fail' + json.response)
      })
  })
})
