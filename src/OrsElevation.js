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
      let url = orsUtil.prepareUrl(that.requestArgs)
      const payload = that.generatePayload(that.requestArgs)

      that.createRequest(url, payload, resolve, reject);
    })
  }

  lineElevation(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs)
    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'elevation/line'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs,this.requestArgs)

    return this.elevationPromise()
  }

  pointElevation(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    orsUtil.setRequestDefaults(this.defaultArgs, this.requestArgs)
    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs[Constants.propNames.service] = 'elevation/point'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs,this.requestArgs)

    return this.elevationPromise()
  }
}

export default OrsElevation
