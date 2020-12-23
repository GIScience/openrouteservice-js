import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'

const orsUtil = new OrsUtil()

class OrsDirections {
  constructor(args) {
    this.requestSettings = null
    this.args = {}
    this.meta = null
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      // eslint-disable-next-line no-console
      console.error('Please add your openrouteservice api_key..')
    }
  }

  clear() {
    for (let variable in this.args) {
      if (variable !== 'api_key') delete this.args[variable]
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

    if (this.meta.profile == 'driving-hgv') {
      options.vehicle_type = 'hgv'
    } else if (this.meta.profile == 'wheelchair') {
      options.vehicle_type = 'wheelchair'
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
