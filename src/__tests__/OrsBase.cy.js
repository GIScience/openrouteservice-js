import OrsBase from '../OrsBase'
import constants from '../constants.js'

const key = Cypress.env('api_key')

describe('Test Base class', () => {

  context('construction', () => {
    it('passes API key correctly', () => {
      const base = new OrsBase({ 'api_key': key })
      expect(base.args, 'Base instance').to.haveOwnProperty('api_key')
      expect(base.args['api_key'], 'api_key arg').to.equal(key)
    })

    it('fails without API key', () => {
      try {
        new OrsBase({})
      } catch (err) {
        expect(err.message).to.equal(constants.missingAPIKeyMsg)
      }
    })

    it('passes Host correctly', () => {
      const base = new OrsBase({ 'api_key': 'test' , 'host': 'localhost:8080'})
      expect(base.args, 'Base instance').to.haveOwnProperty('host')
      expect(base.args['host'], 'host arg').to.equal('localhost:8080')
    })

    it('passes service correctly', () => {
      const base = new OrsBase({ 'api_key': 'test' , 'service': 'test-service'})
      expect(base.args, 'Base instance').to.haveOwnProperty('service')
      expect(base.args['service'], 'service arg').to.equal('test-service')
    })
  })

})
