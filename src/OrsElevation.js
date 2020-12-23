import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'

const orsUtil = new OrsUtil()

class OrsElevation {
  constructor(args) {
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      // eslint-disable-next-line no-console
      console.error('Please add your openrouteservice api_key...')
    }
  }

  clear() {
    for (let variable in this.args) {
      if (variable !== 'api_key') delete this.args[variable]
    }
  }

  generatePayload(args) {
    let payload = {}

    for (const key in args) {
      if (
        key === 'host' ||
        key === 'api_version' ||
        key === 'mime_type' ||
        key === 'api_key'
      ) {
        continue
      } else {
        payload[key] = args[key]
      }
    }
    return payload
  }

  elevationPromise() {
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = 5000

      if (!that.args.host) {
        that.args.host = 'https://api.openrouteservice.org'
      }

      let url = orsUtil.prepareUrl(that.args)

      const payload = that.generatePayload(that.args)
      let authorization = that.args[Constants.propNames.apiKey]
      let orsRequest = request
        .post(url)
        .send(payload)
        .accept(that.args.mime_type)
        .set('Authorization', that.args.api_key)
        .timeout(timeout)
      // .accept(that.meta.mimeType)

      for (let key in that.customHeaders) {
        orsRequest.set(key, that.customHeaders[key])
      }
      orsRequest.end(function(err, res) {
        if (err || !res.ok) {
          console.error(err)
          reject(err)
        } else if (res) {
          resolve(res.body || res.text)
        }
      })
    })
  }

  lineElevation(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs[[Constants.propNames.service]] = 'elevation/line'
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
      reqArgs[[Constants.propNames.service]] = 'elevation/point'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.elevationPromise()
  }
}

export default OrsElevation
