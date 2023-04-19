import OrsIsochrones from '../OrsIsochrones.js'
import Constants from '../constants.js'

const key = Cypress.env('api_key')
const orsIsochrones = new OrsIsochrones({ api_key: key })

describe('Isochrone Test', () => {

  context('construction', () => {
    it('sets correct service and API version', () => {
      expect(orsIsochrones.defaultArgs.service).to.equal('isochrones')
      expect(orsIsochrones.defaultArgs.api_version).to.equal('v2')
    })

    it('fails when API version not default API version', () => {
      try {
        new OrsIsochrones({
          'api_key': 'test',
          'apiVersion': 'v1'
        })
      } catch (err) {
        expect(err.message).to.equal(Constants.useAPIV2Msg)
      }
    })
  })

  context('methods', () => {
    context('getBody', () => {
      it('moves restrictions to profile_params', () => {
        let bodyArgs = orsIsochrones
            .getBody({
              restrictions: {
                r1: '1',
                r2: '2'
              }
            })
        expect(bodyArgs['options']['profile_params']['restrictions']).to.deep.equal({ r1: '1', r2: '2' })
      })

      it('moves avoidables to avoid_features', () => {
        orsIsochrones.httpArgs = { avoidables: [ 'a1', 'a2' ] }
        let bodyArgs = orsIsochrones
        .getBody(orsIsochrones.httpArgs)
        expect(bodyArgs['options']['avoid_features']).to.deep.equal([ 'a1', 'a2' ])
        expect(orsIsochrones.httpArgs.avoidables).to.not.exist
      })

      it('moves avoid_polygons to options property', () => {
        orsIsochrones.httpArgs = {
          avoid_polygons: {
            polygon1: [[8.690958, 49.404662], [8.687868, 49.390139]]
          }}
        let bodyArgs = orsIsochrones
        .getBody(orsIsochrones.httpArgs)
        expect(bodyArgs['options']['avoid_polygons']).to.deep.equal({ polygon1: [[8.690958, 49.404662], [8.687868, 49.390139]] })
        expect(orsIsochrones.httpArgs.avoid_polygons).to.not.exist
      })

      it('if no options in args remove as body property', () => {
        let bodyArgs = orsIsochrones
        .getBody({})
        expect(bodyArgs.options).to.not.exist
      })
    })

    context('calculate', () => {
      it('fails without parameters', (done) => {
        orsIsochrones.calculate({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('gets isochrones results', (done) => {
        orsIsochrones.calculate({
          locations: [
            [8.690958, 49.404662],
            [8.687868, 49.390139]
          ],
          profile: 'driving-car',
          range: [600]
        })
        .then((json) => {
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

      it('gets results with custom host and service', (done) => {
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
          .then((json) => {
            expect(json.features.length).to.equal(2)
            expect(json.type).to.equal('FeatureCollection')
            done()
          })
      })

      it('gets results with avoid polygon', (done) => {
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
          .then((json) => {
            expect(json.metadata.query.options.avoid_polygons.coordinates[0][0].length).to.equal(4)
            done()
          })
      })
    })
  })
})
