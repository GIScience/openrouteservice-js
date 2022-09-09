import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

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

  elevationPromise() {
    const that = this
    return new Promise(function(resolve, reject) {
      const url = orsUtil.prepareUrl(that.defaultArgs)
      const payload = that.generatePayload(that.defaultArgs)

      that.createRequest(url, payload, resolve, reject);
    })
  }

  lineElevation(reqArgs) {
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs)
    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'elevation/line'
    }
    orsUtil.copyProperties(reqArgs, this.defaultArgs)
    return this.elevationPromise()
  }

  pointElevation(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs)
    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'elevation/point'
    }

    orsUtil.copyProperties(reqArgs, this.defaultArgs)
    return this.elevationPromise()
  }
}

export default OrsElevation
