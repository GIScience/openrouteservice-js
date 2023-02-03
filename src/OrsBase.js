import request from 'superagent'
import OrsUtil from './OrsUtil.js'
import Constants from './constants.js'

const orsUtil = new OrsUtil()

class OrsBase {
  constructor(args) {
    this.defaultArgs = {}
    this.requestArgs = {}
    this.argsCache = null
    this.customHeaders = {}

    this._setRequestDefaults(args)
  }

  /**
   * Set defaults for a request comparing with and overwriting default class arguments
   * @param {Object} args - constructor input
   */
  _setRequestDefaults(args) {
    this.defaultArgs[Constants.propNames.host] = Constants.defaultHost
    if (args[Constants.propNames.host]) {
      this.defaultArgs[Constants.propNames.host] = args[Constants.propNames.host]
    }
    if (args[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = args[Constants.propNames.service]
    }
    if (Constants.propNames.apiKey in args) {
      this.defaultArgs[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
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
  }

  createRequest(body, resolve, reject) {
    let url = orsUtil.prepareUrl(this.argsCache)
    if (this.argsCache[Constants.propNames.service] === 'pois') {
      url += url.indexOf('?') > -1 ? '&' : '?'
    }

    const authorization = this.argsCache[Constants.propNames.apiKey]
    const timeout = this.defaultArgs[Constants.propNames.timeout] || 10000

    const orsRequest = request
      .post(url)
      .send(body)
      .set('Authorization', authorization)
      .timeout(timeout)

    for (const key in this.customHeaders) {
      orsRequest.set(key, this.customHeaders[key])
    }
    orsRequest.end(function(err, res) {
      if (err || !res.ok) {
        // eslint-disable-next-line no-console
        console.error(err)
        reject(err)
      } else if (res) {
        resolve(res.body || res.text)
      }
    })
  }

  // is overidden in Directions and Isochrones class
  getBody() {
    return this.httpArgs;
  }

  calculate(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.requestArgs[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

        that.httpArgs = orsUtil.prepareRequest(that.requestArgs)
        const postBody = that.getBody(that.httpArgs)

        that.createRequest(postBody, resolve, reject)
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsBase
