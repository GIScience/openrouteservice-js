/* eslint-disable no-undef */
import OrsGeocode from '../OrsGeocode'
import Constants from '../constants'

const key = Cypress.env('api_key')
const orsGeocode = new OrsGeocode({ api_key: key })

describe('Geocode Test', function () {
  it('Should get geocode results', function (done) {
    orsGeocode.clear()
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
      .then(function (json) {
        expect(json.features.length).to.be.greaterThan(5)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Should not fail Geocode Test ' + json)
      })
  })

  it('Should get geocode results with special char', function (done) {
    orsGeocode.clear()
    orsGeocode
      .geocode({
        text: 'hauptstraße',
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
      .then(function (json) {
        expect(json.features.length).to.be.greaterThan(5)
        expect(json.type).to.equal('FeatureCollection')
        expect(json.features[0].type).to.equal('Feature')
        expect(json.features[1].type).to.equal('Feature')
        expect(json.features[0].geometry.type).to.equal('Point')
        expect(json.features[1].geometry.type).to.equal('Point')
        done()
      })
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Should not fail Geocode Test ' + json)
      })
  })

  it('Should clear Geocode args', function (done) {
    orsGeocode.clear()
    try {
      expect(orsGeocode.args.text).to.be.undefined
      done()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Should not fail Clear Geocode args Test ' + orsGeocode.args)
    }
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
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Should not fail boundaries Test ' + json)
      })
  })
  it('Should geocode structured address', function (done) {
    orsGeocode.clear()
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
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Should not fail address Test ' + json)
      })
  })

  it('Should geocode without result', function (done) {
    orsGeocode.clear()
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
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Geocode without result Test ' + json)
      })
  })
  it('Should reverse Geocode result', function (done) {
    orsGeocode.clear()
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
      .catch(function (json) {
        // eslint-disable-next-line no-console
        console.error('Reverse Geocode result Test ' + json)
      })
  })
})

