import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsElevation extends OrsBase {
  clear() {
    for (const variable in this.args) {
      if (variable !== Constants.propNames.apiKey) delete this.args[variable]
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
      const timeout = that.args[Constants.propNames.timeout] || 5000

      const url = orsUtil.prepareUrl(that.args)

      const payload = that.generatePayload(that.args)
      const authorization = that.args[Constants.propNames.apiKey]
      const orsRequest = request
        .post(url)
        .send(payload)
        .set('Authorization', authorization)
        .timeout(timeout)

      for (const key in that.customHeaders) {
        orsRequest.set(key, that.customHeaders[key])
      }
      orsRequest.end(function(err, res) {
        if (err || !res.ok) {
          // eslint-disable-next-line no-console
          console.error(err)
          reject(err)
        } else if (res) {
          resolve(res.body || res.text)
        }
      })
    })
  }

  lineElevation(reqArgs) {
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'elevation/line'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.elevationPromise()
  }

  pointElevation(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }

    orsUtil.setRequestDefaults(this.args, reqArgs)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'elevation/point'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    return this.elevationPromise()
  }
}

export default OrsElevation
