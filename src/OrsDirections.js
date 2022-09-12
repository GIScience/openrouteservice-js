import Constants from './constants'
import OrsBase from './OrsBase'

class OrsDirections extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'directions'
    }
    if (!args[Constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = Constants.defaultAPIVersion
    }
  }

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
    if (this.argsCache && this.argsCache.profile === 'driving-hgv' && (!args.options || !args.options.vehicle_type)) {
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
}

export default OrsDirections
