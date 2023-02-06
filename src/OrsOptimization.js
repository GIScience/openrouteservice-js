import OrsUtil from "./OrsUtil.js"
import Constants from "./constants.js"
import OrsBase from "./OrsBase.js"

const orsUtil = new OrsUtil()

class OrsOptimization extends OrsBase {
  clear() {
    for (let variable in this.defaultArgs) {
      if (variable !== Constants.propNames.apiKey) delete this.defaultArgs[variable]
    }
  }

  generatePayload(args) {
    let payload = {}

    for (const key in args) {
      if (Constants.baseUrlConstituents.indexOf(key) <= -1) {
        payload[key] = args[key]
      }
    }
    return payload
  }

  async optimizationPromise() {
    this.argsCache = orsUtil.saveArgsToCache(this.requestArgs)

    const payload = this.generatePayload(this.requestArgs)

    return await this.createRequest(payload)
  }

  async optimize(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'optimization'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.optimizationPromise()
  }
}

export default OrsOptimization
