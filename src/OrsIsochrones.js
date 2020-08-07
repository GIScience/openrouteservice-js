import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'

const orsUtil = new OrsUtil()

class OrsIsochrones {
  constructor(args) {
    this.meta = null
    this.args = {}
    if (Constants.propNames.apiKey in args) {
      this.args[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.log(Constants.missingAPIKeyMsg)
    }

    if (Constants.propNames.host in args) {
      this.args[Constants.propNames.host] = args[Constants.propNames.host]
    }
    if (Constants.propNames.service in args) {
      this.args[Constants.propNames.service] = args[Constants.propNames.service]
    }
  }

  addLocation(latlon) {
    if (!('locations' in this.args)) {
      this.args.locations = []
    }
    this.args.locations.push(latlon)
  }

  getBody(args) {
    let options = {}

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
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      reqArgs.service = 'isochrones'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = 10000
      // eslint-disable-next-line prettier/prettier
      if (that.args[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
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
          // .set('Content-Type', that.meta.mimeType)
          // .accept('application/geo+json')
          .timeout(timeout)
          .end(function(err, res) {
            if (err || !res.ok) {
              // eslint-disable-next-line no-console
              console.error(err)
              reject(err)
            } else if (res) {
              resolve(res.body)
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
