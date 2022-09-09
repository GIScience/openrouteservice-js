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
    // the service arg is used to build the target url
    if (!this.defaultArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'pois'
    }
    // the request arg is required by the API as part of the body
    this.defaultArgs.request = this.defaultArgs.request || 'pois'

    const that = this
    return new Promise(function(resolve, reject) {
      let url = orsUtil.prepareUrl(that.defaultArgs)
      url += url.indexOf('?') > -1 ? '&' : '?'

      if (that.defaultArgs[Constants.propNames.service]) {
        delete that.defaultArgs[Constants.propNames.service]
      }

      const payload = that.generatePayload(that.defaultArgs)

      that.createRequest(url, payload, resolve, reject);
    })
  }

  pois(reqArgs) {
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs)
    orsUtil.copyProperties(reqArgs, this.defaultArgs)

    return this.poisPromise()
  }
}

export default OrsPois
