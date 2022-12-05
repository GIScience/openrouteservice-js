import OrsUtil from '../OrsUtil.js'
import Constants from "../constants.js"

const orsUtil = new OrsUtil()

describe('Test Utils', () => {
  it('requestArgs are filled with defaultArgs', () => {
    let response = orsUtil.
      fillArgs({
        a: 'a',
        b: 'b',
        c: 'c'
      },
    {
        d: 'd',
        b: 'b2'
      })
      expect(response).to.include({ b: 'b2' })
  })

  it('args are saved to cache', () => {
    let response = orsUtil.
      saveArgsToCache({
      [Constants.propNames.host]: 'host',
      [Constants.propNames.profile]: 'profile',
      [Constants.propNames.service]: 'service'
      })
    expect(response).to.include({
      host: 'host',
      profile: 'profile',
      service: 'service'
    })
  })

  it('properties are removed', () => {
    let response = orsUtil.
      prepareRequest({
        [Constants.propNames.mimeType]: 'mimetype',
        [Constants.propNames.host]: 'host',
        [Constants.propNames.apiVersion]: 'apiversion',
        [Constants.propNames.service]: 'service',
        [Constants.propNames.apiKey]: 'apikey',
        [Constants.propNames.profile]: 'profile',
        [Constants.propNames.format]: 'format',
        [Constants.propNames.timeout]: 'timeout'
      })
      expect(response).to.not.include({
        [Constants.propNames.mimeType]: '',
        [Constants.propNames.host]: '',
        [Constants.propNames.apiVersion]: '',
        [Constants.propNames.service]: '',
        [Constants.propNames.apiKey]: '',
        [Constants.propNames.profile]: '',
        [Constants.propNames.format]: '',
        [Constants.propNames.timeout]: ''
      })
  })

  it('url is built and has no double slashes', () => {
    let response = orsUtil
    .prepareUrl({
      [Constants.propNames.host]: Constants.defaultHost,
      [Constants.propNames.apiVersion]: 'v2',
      [Constants.propNames.service]: '/directions'
      })
    expect(response.length).to.be.greaterThan(25)
    expect(response).to.include('https://')
    expect(response.slice(7, response.length)).to.not.include('//')

    let noApiVersion = orsUtil
    .prepareUrl({
      [Constants.propNames.host]: Constants.defaultHost,
      [Constants.propNames.service]: 'elevation/line'
    })
    expect(noApiVersion.slice(7, response.length)).to.not.include('//')
  })

  it('url is built and has no slash at end', () => {
    let response = orsUtil
        .prepareUrl({
          [Constants.propNames.host]: Constants.defaultHost,
          [Constants.propNames.apiVersion]: 'v2',
          [Constants.propNames.service]: '/directions/'
        })
    expect(response.slice(-1)).to.not.equal('/')
  })
})
