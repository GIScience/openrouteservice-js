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

  async poisPromise() {
    // the request arg is required by the API as part of the body
    this.requestArgs.request = this.requestArgs.request || 'pois'

    this.argsCache = orsUtil.saveArgsToCache(this.requestArgs)

    if (this.requestArgs[Constants.propNames.service]) {
      delete this.requestArgs[Constants.propNames.service]
    }

    const payload = this.generatePayload(this.requestArgs)

    return await this.createRequest(payload)
  }

  async pois(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.poisPromise()
  }
}

export default OrsPois
