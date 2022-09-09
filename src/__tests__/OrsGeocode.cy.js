/* eslint-disable no-undef */
import OrsGeocode from '../OrsGeocode.js'
import Constants from '../constants.js'

const key = Cypress.env('api_key')
const orsGeocode = new OrsGeocode({ api_key: key })

describe('Geocode Test', function () {
  it('Should get geocode results', function (done) {
    orsGeocode
      .geocode({
        text: 'Namibian Brewery',
        focus_point: [-20.45902199292039, 16.64960861206055],
        layers: [
          'country',
          'region',
          'macrocounty',
          'macroregion',
          'county',
          'neighbourhood',
          'borough',
          'street',
          'address',
          'coarse'
        ]
      })
      .then(function (json) {
        expect(json.features.length).to.be.greaterThan(5)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
  })

  it('Should get geocode results with special char', function (done) {
    orsGeocode
      .geocode({
        text: 'hauptstraße',
        focus_point: [-20.45902199292039, 16.64960861206055],
        layers: [
          'country',
          'region',
          'macrocounty',
          'macroregion',
          'county',
          'neighbourhood',
          'borough',
          'street',
          'address',
          'coarse'
        ]
      })
      .then(function (json) {
        expect(json.features.length).to.be.greaterThan(5)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
  })

  it('Should clear Geocode args', function () {
    expect(orsGeocode.defaultArgs.text).to.be.undefined
  })

  it('Should geocode with boundaries', function (done) {
    new OrsGeocode({
      api_key: key,
      host: Constants.defaultHost,
      service: 'geocode/search'
    })
      .geocode({
        text: 'Heidelberg',
        boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
        boundary_bbox: [
          [49.260929, 8.40063],
          [49.504102, 8.941707]
        ],
        boundary_country: ['DE'],
        locality: 'Heidelberg',
        county: 'Heidelberg',
        region: 'Baden-Württemberg'
      })
      .then(function (json) {
        expect(json.features.length).to.equal(2)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
  })
  it('Should geocode structured address', function (done) {
    orsGeocode
      .geocode({
        text: 'Namibian Brewery',
        point: { lat_lng: [49.436431, 8.673964] },
        sources: ['openstreetmap', 'openaddresses'],
        size: 2,
        country: 'DE'
      })
      .then(function (json) {
        expect(json.features.length).to.equal(2)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
  })

  it('Should geocode without result', function (done) {
    orsGeocode
      .geocode({
        text: 'xzxzxzxtakywqa',
        point: { lat_lng: [49.436431, 8.673964] },
        sources: ['openstreetmap', 'openaddresses'],
        size: 2,
        country: 'DE',
        address: 'Non existing address',
        neighbourhood: 'Non existing neighbourhood',
        borough: 'Non existing borough',
        postalcode: '9999999'
      })
      .then(function (json) {
        expect(json.features.length).to.equal(0)
        expect(json.type).to.equal('FeatureCollection')
        done()
      })
  })
  it('Should reverse Geocode result', function (done) {
    orsGeocode
      .reverseGeocode({
        point: {
          lat_lng: [48.858268, 2.294471],
          radius: 1
        },
        size: 8
      })
      .then(function (json) {
        expect(json.features.length).to.be.greaterThan(5)
        expect(json.type).to.equal('FeatureCollection')
        done()
      })
  })
})

