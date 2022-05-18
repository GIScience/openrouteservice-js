import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'

const orsUtil = new OrsUtil()

class OrsOptimization {
  constructor(args) {
    this.requestSettings = null
    this.args = {}
    this.meta = null
    if (Constants.propNames.apiKey in args) {
      this.args[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.error(Constants.missingAPIKeyMsg)
      throw new Error(Constants.missingAPIKeyMsg)
    }

    if (Constants.propNames.host in args) {
      this.args[Constants.propNames.host] = args[Constants.propNames.host]
    }
    if (Constants.propNames.service in args) {
      this.args[Constants.propNames.service] = args[Constants.propNames.service]
    }
  }

  clear() {
    for (let variable in this.args) {
      if (variable !== Constants.apiKeyPropName) delete this.args[variable]
    }
  }

  optimizationPromise() {
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = that.args[Constants.propNames.timeout] || 5000

      let url = orsUtil.prepareUrl(that.args)

      const payload = that.generatePayload(that.args)
      let authorization = that.args[Constants.propNames.apiKey]
      let orsRequest = request
        .post(url)
        .send(payload)
        .set('Authorization', authorization)
        .timeout(timeout)

      for (let key in that.customHeaders) {
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

  generatePayload(args) {
    let payload = {}

    for (const key in args) {
      if (Constants.baseUrlConstituents.indexOf(key) > -1) {
        continue
      } else {
        payload[key] = args[key]
      }
    }
    return payload
  }

  optimize(reqArgs) {
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[Constants.propNames.service] = 'optimization'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.optimizationPromise()
  }
}

export default OrsOptimization
