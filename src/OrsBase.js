import OrsUtil from './OrsUtil.js'
import Constants from './constants.js'

const orsUtil = new OrsUtil()

class OrsBase {
  constructor(constructorArgs) {
    this.defaultArgs = {}
    this.requestArgs = {}
    this.argsCache = null
    this.customHeaders = {}

    this._setRequestDefaults(constructorArgs)
  }

  /**
   * Set defaults for a request comparing with and overwriting default class arguments
   * @param {Object} args - constructor input
   */
  _setRequestDefaults(constructorArgs) {
    this.defaultArgs[Constants.propNames.host] = Constants.defaultHost
    if (constructorArgs[Constants.propNames.host]) {
      this.defaultArgs[Constants.propNames.host] = constructorArgs[Constants.propNames.host]
    }
    if (constructorArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = constructorArgs[Constants.propNames.service]
    }
    
    if (Constants.propNames.apiKey in constructorArgs) {
      this.defaultArgs[Constants.propNames.apiKey] = constructorArgs[Constants.propNames.apiKey]
    }
    else if (!constructorArgs[Constants.propNames.host]) {
      // Do not error if a host is specified; useful for locally-run instances of ORS
      // eslint-disable-next-line no-console
      console.error(Constants.missingAPIKeyMsg)
      throw new Error(Constants.missingAPIKeyMsg)
    }

  }

  checkHeaders() {
    // Get custom header and remove from args
    if (this.requestArgs.customHeaders) {
      this.customHeaders = this.requestArgs.customHeaders
      delete this.requestArgs.customHeaders
    }
    // set default Content-type, since Postman sets Content-type to text/plain if not specified
    if (!('Content-type' in this.customHeaders)) {
      this.customHeaders = {...this.customHeaders, 'Content-type': 'application/json'}
    }
  }

  async fetchRequest(body, controller) {
    let url = orsUtil.prepareUrl(this.argsCache)
    if (this.argsCache[Constants.propNames.service] === 'pois') {
      url += url.indexOf('?') > -1 ? '&' : '?'
    }

    const authorization = {'Authorization': this.argsCache[Constants.propNames.apiKey]}

    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {...authorization, ...this.customHeaders},
      signal: controller.signal
    })
  }

  async createRequest(body) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort('timed out'), this.defaultArgs[Constants.propNames.timeout] || 5000)

    try {
      const orsResponse = await this.fetchRequest(body, controller)

      if (!orsResponse.ok) {
        const error = new Error(orsResponse.statusText)
        error.status = orsResponse.status
        error.response = orsResponse
        throw error
      }

      return this.argsCache?.format === 'gpx' ? await orsResponse.text() : await orsResponse.json()
    } finally {
      clearTimeout(timeout)
    }
  }

  // is overidden in Directions and Isochrones class
  getBody() {
    return this.httpArgs;
  }

  async calculate(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    this.argsCache = orsUtil.saveArgsToCache(this.requestArgs)

    this.httpArgs = orsUtil.prepareRequest(this.requestArgs)
    const postBody = this.getBody(this.httpArgs)

    return await this.createRequest(postBody)
  }
}

export default OrsBase
