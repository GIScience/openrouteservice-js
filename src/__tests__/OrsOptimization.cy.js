import OrsOptimization from '../OrsOptimization.js'

const key = Cypress.env('api_key')
const orsOptimization = new OrsOptimization({ 'api_key': key })

describe('Optimization Test', function() {

  context('methods', () => {
    context('generatePayload', () => {
      it('writes args into payload if not base URL constituents', () => {
        let payload = orsOptimization
            .generatePayload({
              host: 'host',
              service: 'service',
              notUrlConstituent: 'notUrlConstituent'
            })
        expect(payload).to.deep.equal({notUrlConstituent: 'notUrlConstituent'})
      })
    })

    context('optimize', () => {
      it('sets correct service', () => {
        orsOptimization.optimize({
          jobs: [
            {
              id: 1,
              location: [1.98935, 48.701]
            },
            {
              id: 2,
              location: [2.03655, 48.61128]
            }
          ],
          vehicles: [
            {
              id: 1,
              profile: 'driving-car',
              start: [2.35044, 48.71764],
              end: [2.35044, 48.71764]
            }
          ]
        })
        expect(orsOptimization.requestArgs.service).to.equal('optimization')
      })

      it('fails without parameters', (done) => {
        orsOptimization.optimize({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('generates routes', (done) => {
        orsOptimization.optimize({
          jobs: [
            {
              id: 1,
              amount: [1],
              location: [1.98935, 48.701],
              skills: [1]
            },
            {
              id: 2,
              amount: [1],
              location: [2.03655, 48.61128],
              skills: [2]
            },
            {
              id: 3,
              amount: [1],
              location: [2.39719, 49.07611],
              skills: [14]
            }
          ],
          vehicles: [
            {
              id: 1,
              profile: 'driving-car',
              start: [2.35044, 48.71764],
              end: [2.35044, 48.71764],
              capacity: [2],
              skills: [1, 14]
            },
            {
              id: 2,
              profile: 'driving-car',
              start: [2.35044, 48.71764],
              end: [2.35044, 48.71764],
              capacity: [2],
              skills: [2, 14]
            }
          ]
        })
        .then(function (json) {
          expect(json['summary']['unassigned']).to.equal(0)
          expect(json['summary']['delivery'][0]).to.equal(3)
          expect(json['routes']['length']).to.equal(2)
          done()
        })
      })
    })
  })

  context('unused functions', () => {
    it('clear() clears everything but API key', () => {
      orsOptimization.defaultArgs = {
        variable1: 'v1',
        api_key: 'API key'
      }
      orsOptimization.clear()
      expect(orsOptimization.defaultArgs).to.deep.equal({api_key: 'API key'})
    })
  })
})