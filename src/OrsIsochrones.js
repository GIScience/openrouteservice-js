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
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs, true)
    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs.service = 'isochrones'
    }

    orsUtil.copyProperties(reqArgs, this.defaultArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.defaultArgs[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        if (that.meta == null) {
          that.meta = orsUtil.prepareMeta(that.defaultArgs)
        }
        that.httpArgs = orsUtil.prepareRequest(that.defaultArgs)
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
