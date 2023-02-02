import OrsGeocode from '../OrsGeocode.js'
import Constants from '../constants.js'

const key = Cypress.env('api_key')
const orsGeocode = new OrsGeocode({ api_key: key })

describe('Geocode Test', () => {

  context('construction', () => {
    it('clears geocode args', () => {
      expect(orsGeocode.defaultArgs.text).to.be.undefined
    })
  })

  context('methods', () => {
    context('getParametersAsQueryString', () => {
      it('writes args into query string if not base URL constituents', () => {
        let query = orsGeocode
        .getParametersAsQueryString({
          host: 'host',
          service: 'service',
          api_key: 'ApiKey',
          country: 'country'
        })
        expect(query).to.deep.equal('api_key=ApiKey&country=country')
      })
    })

    context('geocode', () => {
      it('sets correct service', () => {
        orsGeocode.geocode({
          text: 'Namibian Brewery',
          focus_point: [-20.45902199292039, 16.64960861206055]
        })
        expect(orsGeocode.requestArgs.service).to.equal('geocode/search')
      })

      it('fails without parameters', (done) => {
        orsGeocode.geocode({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('gets geocode results', (done) => {
        orsGeocode.geocode({
          text: 'Namibian Brewery',
          focus_point: [-20.45902199292039, 16.64960861206055]
        })
        .then((json) => {
          expect(json.features.length).to.be.greaterThan(5)
          expect(json.type).to.equal('FeatureCollection')
          expect(json.features[0].type).to.equal('Feature')
          expect(json.features[1].type).to.equal('Feature')
          expect(json.features[0].geometry.type).to.equal('Point')
          expect(json.features[1].geometry.type).to.equal('Point')
          done()
        })
      })

      it('gets geocode results with special char', (done) => {
          orsGeocode.geocode({
          text: 'hauptstraße',
          focus_point: [-20.45902199292039, 16.64960861206055]
        })
        .then((json) => {
          expect(json.geocoding.query.text).to.equal('hauptstraße')
          done()
        })
      })

      it('gets geocode results with boundaries', (done) => {
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
        .then((json) => {
          expect(json.features[0].geometry.coordinates[0]).to.be.within(8.40063, 8.941707)
          expect(json.features[0].geometry.coordinates[1]).to.be.within(49.260929, 49.504102)
          expect(json.features[1].geometry.coordinates[0]).to.be.within(8.40063, 8.941707)
          expect(json.features[1].geometry.coordinates[1]).to.be.within(49.260929, 49.504102)
          done()
        })
      })

      it('gets geocode results with structured address', (done) => {
        orsGeocode.geocode({
          text: 'Namibian Brewery',
          point: { lat_lng: [49.436431, 8.673964] },
          sources: ['openstreetmap', 'openaddresses'],
          size: 1,
          country: 'DE'
        })
        .then((json) => {
          expect(json.features.length).to.equal(1)
          expect(json.type).to.equal('FeatureCollection')
          expect(json.features[0].type).to.equal('Feature')
          expect(json.features[0].geometry.type).to.equal('Point')
          done()
        })
      })

      it('gets geocode without result', (done) => {
        orsGeocode.geocode({
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
        .then((json) => {
          expect(json.features.length).to.equal(0)
          expect(json.type).to.equal('FeatureCollection')
          done()
        })
      })

      it('uses customHeaders', (done) => {
        orsGeocode.geocode({
          text: 'Heidelberg',
          boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
          customHeaders: {'Accept': 'application/json'}
        }).then((json) => {
          expect(json.features.length).to.equal(2)
          expect(json.type).to.equal('FeatureCollection')
          done()
        })
      })
    })

    context('reverse geocode', () => {
      it('sets correct service', () => {
        orsGeocode.reverseGeocode({
          point: {
            lat_lng: [48.858268, 2.294471],
            radius: 1
          },
          size: 8
        })
        expect(orsGeocode.requestArgs.service).to.equal('geocode/reverse')
      })

      it('gets reverse geocode results', (done) => {
        orsGeocode.reverseGeocode({
          point: {
            lat_lng: [48.858268, 2.294471],
            radius: 1
          },
          size: 8
        })
        .then((json) => {
          expect(json.features.length).to.be.greaterThan(5)
          expect(json.type).to.equal('FeatureCollection')
          done()
        })
      })
    })

    context('structured geocode', () => {
      it('sets correct service', () => {
        orsGeocode.structuredGeocode({
          locality: 'Tokyo',
          focus_point: [139.75708, 35.68407]
        })
        expect(orsGeocode.requestArgs.service).to.equal('geocode/search/structured')
      })

      it('gets structured geocode results', (done) => {
        orsGeocode.structuredGeocode({
          locality: 'Tokyo',
          focus_point: [139.75708, 35.68407]
        })
        .then((json) => {
          expect(json.features.length).to.be.greaterThan(5)
          expect(json.type).to.equal('FeatureCollection')
          done()
        })
      })
    })
  })

  context('unused functions', () => {
    it('clear() clears everything but API key', () => {
      orsGeocode.defaultArgs = {
        variable1: 'v1',
        api_key: 'API key'
      }
      orsGeocode.clear()
      expect(orsGeocode.defaultArgs).to.deep.equal({api_key: 'API key'})
    })
  })
})

