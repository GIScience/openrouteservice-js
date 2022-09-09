import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsIsochrones extends OrsBase {
  addLocation(latlon) {
    if (!('locations' in this.defaultArgs)) {
      this.defaultArgs.locations = []
    }
    this.defaultArgs.locations.push(latlon)
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

  calculate(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    orsUtil.setRequestDefaults(this.defaultArgs, this.requestArgs, true)
    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs.service = 'isochrones'
    }

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

export default OrsIsochrones
