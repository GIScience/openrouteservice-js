import Constants from './constants.js'
import OrsBase from './OrsBase.js'

class OrsIsochrones extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.defaultArgs.service = 'isochrones'
    }
    if (!args[Constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = Constants.defaultAPIVersion
    }
  }

  getBody(args) {
    const options = {}

    if (args.restrictions) {
      options.profile_params = {
        restrictions: {
          ...args.restrictions
        }
      }
      delete args.restrictions
    }
    if (args.avoidables) {
      options.avoid_features = [...args.avoidables]
      delete args.avoidables
    }

    if (args.avoid_polygons) {
      options.avoid_polygons = {
        ...args.avoid_polygons
      }
      delete args.avoid_polygons
    }

    if (Object.keys(options).length > 0) {
      return {
        ...args,
        options: options
      }
    } else {
      return {
        ...args
      }
    }
  }
}

export default OrsIsochrones
