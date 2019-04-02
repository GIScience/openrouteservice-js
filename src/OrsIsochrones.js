import request from 'superagent'
import Promise from 'bluebird'
import Joi from 'joi'
import OrsUtil from './OrsUtil'

import isochronesSchema from '../schemas/OrsIsochronesSchema'

const orsUtil = new OrsUtil()

class OrsIsochrones {
  constructor(args) {
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      console.log('Please add your openrouteservice api_key..')
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
        restrictions: args.restrictions
      }
      delete args.restrictions
    }
    if (args.avoidables) {
      options.avoid_features = [...args.avoidables]
      delete args.avoidables
    }

    if (args.avoid_polygons) {
      options.avoid_polygons = args.avoid_polygons
      delete args.avoid_polygons
    }

    if (Object.keys(options).length > 0) {
      return { ...args, options: options }
    } else {
      return { ...args }
    }
  }

  calculate(reqArgs) {
    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      Joi.validate(that.args, isochronesSchema, function(err, value) {
        if (err !== null) reject(new Error(err))

        const timeout = 10000
        that.args = value
        if (that.args.api_version === 'v2') {
          const requestSettings = orsUtil.prepareRequest(
            that.args,
            'isochrones'
          )

          const url = [
            requestSettings.meta.host,
            requestSettings.meta.apiVersion,
            requestSettings.meta.service,
            requestSettings.meta.profile,
            requestSettings.meta.format
          ].join('/')

          const postBody = that.getBody(requestSettings.httpArgs)

          request
            .post(url)
            .send(postBody)
            .set('Authorization', requestSettings.meta.apiKey)
            .set('Content-Type', requestSettings.meta.mimeType)
            .accept('application/geo+json')
            .timeout(timeout)
            .end(function(err, res) {
              //console.log(res.body, res.headers, res.status)
              if (err || !res.ok) {
                console.log(err)
                //reject(ghUtil.extractError(res, url));
                reject(new Error(err))
              } else if (res) {
                resolve(res.body)
              }
            })
        }
      })
    })
  }
}

export default OrsIsochrones
