import OrsBase from '../OrsBase.js'
import constants from '../constants.js'

const key = Cypress.env('api_key')

describe('Test Base class', () => {

  context('construction', () => {
    it('passes API key correctly', () => {
      const base = new OrsBase({ 'api_key': key })
      expect(base.defaultArgs, 'Base instance').to.haveOwnProperty('api_key')
      expect(base.defaultArgs['api_key'], 'api_key arg').to.equal(key)
    })

    it('fails without API key', () => {
      try {
        new OrsBase({})
      } catch (err) {
        expect(err.message).to.equal(constants.missingAPIKeyMsg)
      }
    })

    it('passes Host correctly', () => {
      const base = new OrsBase({
        'host': 'localhost:8080'
      })
      expect(base.defaultArgs, 'Base instance').to.haveOwnProperty('host')
      expect(base.defaultArgs['host'], 'host arg').to.equal('localhost:8080')
    })

    it('passes service correctly', () => {
      const base = new OrsBase({
        'api_key': 'test',
        'service': 'test-service'
      })
      expect(base.defaultArgs, 'Base instance').to.haveOwnProperty('service')
      expect(base.defaultArgs['service'], 'service arg').to.equal('test-service')
    })
  })

  context('methods', () => {
    context('_setRequestDefaults', () => {
      it('sets defaultArgs from args', () => {
        const base = new OrsBase({ 'api_key': 'test' })
        base._setRequestDefaults({
          'api_key': 'test',
          [constants.propNames.service]: 'service',
          [constants.propNames.host]: 'host'
        })
        expect(base.defaultArgs).to.include({
          [constants.propNames.service]: 'service',
          [constants.propNames.host]: 'host'
        })
      })

      it('sets the default host when not in args', () => {
        const base = new OrsBase({ 'api_key': 'test' })
        base._setRequestDefaults({ 'api_key': 'test' })
        expect(base.defaultArgs).to.include({
          [constants.propNames.host]: constants.defaultHost
        })
      })
    })

    context('checkHeaders', () => {
      it('sets customHeaders', () => {
        const base = new OrsBase({ 'api_key': 'test' })
        base.requestArgs = {
          customHeaders: ['customHeader']
        }
        base.checkHeaders()
        expect(base.customHeaders).to.not.be.empty
        expect(base.requestArgs).to.not.include({customHeaders: []})
      })
    })
  })
})
