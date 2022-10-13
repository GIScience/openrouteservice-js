import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsDirections extends OrsBase {
  clear() {
    for (const variable in this.args) {
      if (variable !== Constants.apiKeyPropName) delete this.args[variable]
    }
  }

  clearPoints() {
    if ('coordinates' in this.args) this.args.coordinates.length = 0
  }

  addWaypoint(latLon) {
    if (!('coordinates' in this.args)) {
      this.args.coordinates = []
    }
    this.args.coordinates.push(latLon)
  }

  getBody(args) {
    if (args.options && typeof args.options !== 'object') {
      args.options = JSON.parse(args.options)
    }

    // Set the default vehicle type when profile is 'driving-hgv' if it is missing
    if (this.meta && this.meta.profile === 'driving-hgv' && (!args.options || !args.options.vehicle_type)) {
      args.options = args.options || {}
      args.options.vehicle_type = 'hgv'
    }

    if (args.restrictions) {
      args.options = args.options || {}
      args.options.profile_params = {
        restrictions: { ...args.restrictions }
      }
      delete args.options.restrictions
    }

    if (args.avoidables) {
      args.options = args.options || {}
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
      const timeout = that.args[Constants.propNames.timeout] || 10000
      // meta should be generated once that subsequent requests work
      if (that.meta == null) {
        that.meta = orsUtil.prepareMeta(that.args)
      }
      that.httpArgs = orsUtil.prepareRequest(that.args)
      const url = orsUtil.prepareUrl(that.meta)

      const postBody = that.getBody(that.httpArgs)
      const authorization = that.meta[Constants.propNames.apiKey]
      const orsRequest = request
        .post(url)
        .send(postBody)
        .set('Authorization', authorization)
        .timeout(timeout)
      // .accept(that.meta.mimeType)

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
}

export default OrsDirections
