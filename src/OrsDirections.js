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
    let options = {}

    if (this.meta.profile === 'driving-hgv') {
      if (args.options && args.options.vehicle_type) {
        options.vehicle_type = args.options.vehicle_type
        // round trip does not support vehicle type
      } else if (!args.options.round_trip) {
        options.vehicle_type = 'hgv'
      }
    }

    if (args.restrictions) {
      options.profile_params = {
        restrictions: { ...args.restrictions }
      }
      delete args.restrictions
    }

    if (args.avoidables) {
      options.avoid_features = [...args.avoidables]
      delete args.avoidables
    }

    if (args.avoid_polygons) {
      options.avoid_polygons = { ...args.avoid_polygons }
      delete args.avoid_polygons
    }

    if (Object.keys(options).length > 0) {
      return { ...args, options: options }
    } else {
      return { ...args }
    }
  }

  calculate(reqArgs) {
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
      request
        .post(url)
        .send(postBody)
        .set('Authorization', authorization)
        // .accept(that.meta.mimeType)
        .timeout(timeout)
        .end(function(err, res) {
          if (err || !res.ok) {
            reject(err)
          } else if (res) {
            resolve(res.body || res.text)
          }
        })
    })
  }
}

export default OrsDirections
