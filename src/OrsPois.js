import Promise from 'bluebird'
import OrsUtil from './OrsUtil.js'
import Constants from './constants.js'
import OrsBase from './OrsBase.js'

const orsUtil = new OrsUtil()

class OrsPois extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'pois'
    }
  }

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
      that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

      if (that.requestArgs[Constants.propNames.service]) {
        delete that.requestArgs[Constants.propNames.service]
      }

      const payload = that.generatePayload(that.requestArgs)

      that.createRequest(payload, resolve, reject);
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
