import OrsUtil from './OrsUtil.js'
import Constants from './constants.js'
import OrsBase from './OrsBase.js'

const orsUtil = new OrsUtil()

class OrsElevation extends OrsBase {
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== Constants.propNames.apiKey) delete this.defaultArgs[variable]
    }
  }

  generatePayload(args) {
    const payload = {}

    for (const key in args) {
      if (Constants.baseUrlConstituents.indexOf(key) <= -1) {
        payload[key] = args[key]
      }
    }
    return payload
  }

  async elevationPromise() {
    this.argsCache = orsUtil.saveArgsToCache(this.requestArgs)

    const payload = this.generatePayload(this.requestArgs)

    return await this.createRequest(payload)
  }

  async lineElevation(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs[Constants.propNames.service] = 'elevation/line'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.elevationPromise()
  }

  async pointElevation(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs[Constants.propNames.service] = 'elevation/point'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.elevationPromise()
  }
}

export default OrsElevation
