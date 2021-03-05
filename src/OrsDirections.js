import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'

const orsUtil = new OrsUtil()

class OrsDirections {
  constructor(args) {
    this.requestSettings = null
    this.args = {}
    this.meta = null
    if (Constants.propNames.apiKey in args) {
      this.args[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.error(Constants.missingAPIKeyMsg)
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

  clearPoints() {
    if ('coordinates' in this.args) this.args.coordinates.length = 0
  }

  addWaypoint(latlon) {
    if (!('coordinates' in this.args)) {
      this.args.coordinates = []
    }
    this.args.coordinates.push(latlon)
  }

  getBody(args) {
    if (args.options && typeof args.options !== 'object') {
      args.options = JSON.parse(args.options)
    }

    // Set the default vehicle type when profile is 'driving-hgv' if it is missing
    // eslint-disable-next-line prettier/prettier
    if (this.meta && this.meta.profile === 'driving-hgv' && (!args.options || !args.options.vehicle_type)) {
      args.options.vehicle_type = 'hgv'
    }

    if (args.restrictions) {
      args.options.profile_params = {
        restrictions: { ...args.restrictions }
      }
      delete args.options.restrictions
    }

    if (args.avoidables) {
      args.options.avoid_features = [...args.avoidables]
      delete args.avoidables
    }
    return args
  }

  calculate(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    if (!this.args[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'directions'
    }
    orsUtil.copyProperties(reqArgs, this.args)

    const that = this
    return new Promise(function(resolve, reject) {
      const timeout = 10000
      // meta should be generated once that subsequent requests work
      if (that.meta == null) {
        that.meta = orsUtil.prepareMeta(that.args)
      }
      that.httpArgs = orsUtil.prepareRequest(that.args)
      let url = orsUtil.prepareUrl(that.meta)

      const postBody = that.getBody(that.httpArgs)
      let authorization = that.meta[Constants.propNames.apiKey]
      let orsRequest = request
        .post(url)
        .send(postBody)
        .set('Authorization', authorization)
        .timeout(timeout)
      // .accept(that.meta.mimeType)

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
}

export default OrsDirections
