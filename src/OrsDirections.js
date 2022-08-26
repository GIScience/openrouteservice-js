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
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    if (!this.args[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'directions'
    }
    orsUtil.copyProperties(reqArgs, this.args)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.meta == null) {
        that.meta = orsUtil.prepareMeta(that.args)
      }
      that.httpArgs = orsUtil.prepareRequest(that.args)
      const postBody = that.getBody(that.httpArgs)

      that.createRequest(null, postBody, resolve, reject);
    })
  }
}

export default OrsDirections
