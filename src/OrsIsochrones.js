import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsIsochrones extends OrsBase {
  addLocation(latlon) {
    if (!('locations' in this.args)) {
      this.args.locations = []
    }
    this.args.locations.push(latlon)
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
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs.service = 'isochrones'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = that.args[Constants.propNames.timeout] || 10000
      // eslint-disable-next-line prettier/prettier
      if (that.args[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
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
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsIsochrones
