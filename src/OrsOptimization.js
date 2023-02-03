import OrsUtil from "./OrsUtil.js"
import Constants from "./constants.js"
import OrsBase from "./OrsBase.js"

const orsUtil = new OrsUtil()

class OrsOptimization extends OrsBase {
  generatePayload(args) {
    let payload = {}

    for (const key in args) {
      if (Constants.baseUrlConstituents.indexOf(key) <= -1) {
        payload[key] = args[key]
      }
    }
    return payload
  }

  optimizationPromise() {
    const that = this

    return new Promise(function(resolve, reject) {
      that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

      const payload = that.generatePayload(that.requestArgs)

      that.createRequest(payload, resolve, reject);
    })
  }

  optimize(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'optimization'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return this.optimizationPromise()
  }
}

export default OrsOptimization
