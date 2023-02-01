import OrsDirections from '../OrsDirections.js'
import Constants from '../constants.js'

const key = Cypress.env('api_key')
const orsDirections = new OrsDirections({ 'api_key': key })

describe('Test Directions', () => {

  context('construction', () => {
    it('sets correct service and API version', () => {
      expect(orsDirections.defaultArgs.service).to.equal('directions')
      expect(orsDirections.defaultArgs.api_version).to.equal('v2')
    })

    it('fails when API version not default API version', () => {
      try {
        new OrsDirections({
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
      it('parses json.options if not an object', () => {
        let bodyArgs = orsDirections
        .getBody({'options': '{ "option1": "o1", "option2": "o2" }'})
        expect(bodyArgs['options']).to.deep.equal({ "option1": "o1", "option2": "o2" })
      })

      it('sets default vehicle type', () => {
        orsDirections.argsCache = {
          profile: 'driving-hgv'
        }
        let noOptions = orsDirections
          .getBody({})
        expect(noOptions['options']['vehicle_type']).to.equal('hgv')

        let noVehicleType = orsDirections
            .getBody({ options: {} })
        expect(noVehicleType['options']['vehicle_type']).to.equal('hgv')
      })

      it('moves restrictions to profile_params', () => {
        let bodyArgs = orsDirections
          .getBody({
            restrictions: {
              r1: '1',
              r2: '2'
            }
          })
        expect(bodyArgs['options']['profile_params']['restrictions']).to.deep.equal({ r1: '1', r2: '2' })
      })

      it('moves avoidables to avoid_features', () => {
        let bodyArgs = orsDirections
          .getBody({
            avoidables: [ 'a1', 'a2' ]
          })
        expect(bodyArgs['options']['avoid_features']).to.deep.equal([ 'a1', 'a2' ])
      })
    })

    context('calculate', () => {
      it('fails without parameters', (done) => {
        orsDirections.calculate({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('generates a simple route', (done) => {
        orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'driving-car',
          format: 'json'
        }).then((json) => {
          expect(json['routes'].length).to.be.greaterThan(0)
          expect(json['routes'][0].summary.distance).to.be.greaterThan(2300)
          expect(json['routes'][0].summary.distance).to.be.lessThan(2500)
          done()
        })
      })

      it('adjusts reqArgs for multiple requests', async () => {
        let json1 = await orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'cycling-regular'
        })
        expect(orsDirections.argsCache.profile).to.equal('cycling-regular')
        let json2 = await orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'foot-walking'
        })
        expect(orsDirections.argsCache.profile).to.equal('foot-walking')

        expect(json1).to.haveOwnProperty('metadata')
        expect(json2).to.haveOwnProperty('metadata')
        expect(json1['metadata']).to.not.equal(json2['metadata'])
        expect(json1['metadata']['query']['profile']).to.equal('cycling-regular')
        expect(json2['metadata']['query']['profile']).to.equal('foot-walking')
      })

      it('sets customHeaders in request', (done) => {
        orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'driving-car',
          format: 'geojson',
          customHeaders: {'Accept': 'application/json'}
        }).catch((err) => {
          expect(err.message.length).to.be.greaterThan(0)
          expect(err.response.accepted).to.equal(false)
          expect(err.response.header['content-type']).to.equal('application/json')
          done()
        })
      })
    })
  })

  context('unused functions', () => {
    it('clear() clears everything but API key', () => {
      orsDirections.defaultArgs = {
        variable1: 'v1',
        api_key: 'API key'
      }
      orsDirections.clear()
      expect(orsDirections.defaultArgs).to.deep.equal({api_key: 'API key'})
    })

    it('clearPoints() clears only coordinates', () => {
      orsDirections.defaultArgs = {
        'coordinates': [[8.690958, 49.404662], [8.687868, 49.390139]],
        'otherArg': [1, 2]
      }
      orsDirections.clearPoints()
      expect(orsDirections.defaultArgs.coordinates.length).to.equal(0)
      expect(orsDirections.defaultArgs.otherArg.length).to.equal(2)
    })

    context('addWaypoint', () => {
      it('addWaypoint() adds coordinates', () => {
        orsDirections.defaultArgs.coordinates = [[8.690958, 49.404662]]
        orsDirections.addWaypoint([8.687868, 49.390139])
        expect(orsDirections.defaultArgs.coordinates.length).to.equal(2)
      })

      it('addWaypoint() creates pÁroperty if not existing', () => {
        orsDirections.defaultArgs = {}
        orsDirections.addWaypoint()
        expect(orsDirections.defaultArgs).to.have.property('coordinates')
      })
    })
  })
})
