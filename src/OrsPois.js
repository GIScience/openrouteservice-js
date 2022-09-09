import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsPois extends OrsBase {
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== Constants.propNames.apiKey) delete this.defaultArgs[variable]
    }
  }

  generatePayload(args) {
    const payload = {}

    for (const key in args) {
      if (
        !(
          Constants.baseUrlConstituents.indexOf(key) > -1 ||
          key === Constants.propNames.apiKey ||
          key === Constants.propNames.timeout
        )
      ) {
        payload[key] = args[key]
      }
    }
    return payload
  }

  poisPromise() {
    // the request arg is required by the API as part of the body
    this.requestArgs.request = this.requestArgs.request || 'pois'

    const that = this
    return new Promise(function(resolve, reject) {
      let url = orsUtil.prepareUrl(that.requestArgs)
      url += url.indexOf('?') > -1 ? '&' : '?'

      // that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

      if (that.requestArgs[Constants.propNames.service]) {
        delete that.requestArgs[Constants.propNames.service]
      }

      const payload = that.generatePayload(that.requestArgs)

      that.createRequest(url, payload, resolve, reject);
    })
  }

  pois(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs,this.requestArgs)

    return this.poisPromise()
  }
}

export default OrsPois
