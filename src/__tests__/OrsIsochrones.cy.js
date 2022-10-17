/* eslint-disable no-undef */
import OrsIsochrones from '../OrsIsochrones'
import Constants from '../constants'

const key = Cypress.env('api_key')
const orsIsochrones = new OrsIsochrones({ api_key: key })

describe('Isochrone Test', function () {
  it('Get results', function (done) {
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
      .then(function (json) {
        expect(json.features.length).to.equal(2)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Polygon')
        expect(json.features[1].geometry.type).to.equal('Polygon')
        expect(json.features[0].properties.value).to.equal(600)
        expect(json.features[1].properties.value).to.equal(600)
        done()
      })
  })
  it('Get results with custom host and service', function (done) {
    new OrsIsochrones({
      api_key: key,
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
      .then(function (json) {
        expect(json.features.length).to.equal(2)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Polygon')
        expect(json.features[1].geometry.type).to.equal('Polygon')
        expect(json.features[0].properties.value).to.equal(600)
        expect(json.features[1].properties.value).to.equal(600)
        done()
      })
  })

  it('Get results with avoid polygon', function (done) {
    new OrsIsochrones({ api_key: key })
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
      .then(function (json) {
        expect(json.features.length).to.equal(2)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Polygon')
        expect(json.features[1].geometry.type).to.equal('Polygon')
        expect(json.features[0].properties.value).to.equal(600)
        expect(json.features[1].properties.value).to.equal(600)
        done()
      })
  })
})
