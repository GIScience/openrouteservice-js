import OrsMatrix from '../OrsMatrix.js'
import Constants from '../constants.js'

const key = Cypress.env('api_key')
const orsMatrix = new OrsMatrix({ api_key: key })

describe('Matrix Test', () => {

  context('construction', () => {
    it('sets correct service and API version', () => {
      expect(orsMatrix.defaultArgs.service).to.equal('matrix')
      expect(orsMatrix.defaultArgs.api_version).to.equal('v2')
    })

    it('fails when API version not default API version', () => {
      try {
        new OrsMatrix({
          'api_key': 'test',
          'apiVersion': 'v1'
        })
      } catch (err) {
        expect(err.message).to.equal(Constants.useAPIV2Msg)
      }
    })
  })

  context('methods', () => {
    context('calculate', () => {
      it('fails without parameters', (done) => {
        orsMatrix.calculate({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('gets matrix results', (done) => {
        orsMatrix.calculate({
          locations: [
            [8.690958, 49.404662],
            [8.687868, 49.390139],
            [8.687868, 49.390133]
          ],
          profile: 'driving-car',
          sources: ['all'],
          destinations: ['all']
        })
        .then((json) => {
          expect(json.durations.length).to.equal(3)
          expect(json.destinations.length).to.equal(3)
          done()
        })
      })
    })
  })
})
