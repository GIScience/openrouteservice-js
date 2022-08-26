import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsPois extends OrsBase {
  clear() {
    for (const variable in this.args) {
      if (variable !== Constants.propNames.apiKey) delete this.args[variable]
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
    if (!this.args[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'pois'
    }
    // the request arg is required by the API as part of the body
    this.args.request = this.args.request || 'pois'

    const that = this
    return new Promise(function(resolve, reject) {
      let url = orsUtil.prepareUrl(that.args)
      url += url.indexOf('?') > -1 ? '&' : '?'

      if (that.args[Constants.propNames.service]) {
        delete that.args[Constants.propNames.service]
      }

      const payload = that.generatePayload(that.args)

      that.createRequest(url, payload, resolve, reject);
    })
  }

  pois(reqArgs) {
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.args, reqArgs)
    orsUtil.copyProperties(reqArgs, this.args)

    return this.poisPromise()
  }
}

export default OrsPois
