import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

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

  calculate(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs,this.requestArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.requestArgs[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

        that.httpArgs = orsUtil.prepareRequest(that.requestArgs)
        const postBody = that.getBody(that.httpArgs)

        that.createRequest(null, postBody, resolve, reject);
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsDirections
