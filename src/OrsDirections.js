import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsDirections extends OrsBase {
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== Constants.apiKeyPropName) delete this.defaultArgs[variable]
    }
  }

  clearPoints() {
    if ('coordinates' in this.defaultArgs) this.defaultArgs.coordinates.length = 0
  }

  addWaypoint(latLon) {
    if (!('coordinates' in this.defaultArgs)) {
      this.defaultArgs.coordinates = []
    }
    this.defaultArgs.coordinates.push(latLon)
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
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs, true)
    if (!this.defaultArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'directions'
    }
    orsUtil.copyProperties(reqArgs, this.defaultArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.meta == null) {
        that.meta = orsUtil.prepareMeta(that.defaultArgs)
      }
      that.httpArgs = orsUtil.prepareRequest(that.defaultArgs)
      const postBody = that.getBody(that.httpArgs)

      that.createRequest(null, postBody, resolve, reject);
    })
  }
}

export default OrsDirections
