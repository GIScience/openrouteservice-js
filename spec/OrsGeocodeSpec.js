/* eslint-disable no-undef */
import OrsGeocode from '../src/OrsGeocode'
import Constants from '../src/constants'

describe('No api key Geocode Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsGeocode({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key Geocode Test ' + error)
    }
  })
})

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
        done.fail('Should not fail Geocode Test ' + json)
      })
  })
})

describe('Clear Geocode args Test', function() {
  it('Get results', function(done) {
    orsGeocode.clear()
    try {
      expect(orsGeocode.args.text).toBeUndefined()
      done()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(orsGeocode.args)
      done.fail('Should not fail Clear Geocode args Test ' + orsGeocode.args)
    }
  })
})

describe('Geocode with boundaries Test', function() {
  it('Get results', function(done) {
    new OrsGeocode({
      api_key: process.env.ORSKEY,
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
      .then(function(json) {
        expect(json.features.length).toEqual(2)
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
        done.fail('Should not fail boundaries Test ' + json)
      })
  })
})

describe('Geocode structure address Test', function() {
  it('Get results', function(done) {
    orsGeocode
      .geocode({
        text: 'Namibian Brewery',
        point: { lat_lng: [49.436431, 8.673964] },
        sources: ['openstreetmap', 'openaddresses'],
        size: 2,
        country: 'DE'
      })
      .then(function(json) {
        expect(json.features.length).toEqual(2)
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
        done.fail('Should not fail address Test ' + json)
      })
  })
})

describe('Geocode without result Test', function() {
  it('Get results', function(done) {
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
      .then(function(json) {
        expect(json.features.length).toEqual(0)
        expect(json.type).toEqual('FeatureCollection')
        done()
      })
      .catch(function(json) {
        // eslint-disable-next-line no-console
        console.log(json)
        done.fail('Geocode without result Test ' + json)
      })
  })
})
