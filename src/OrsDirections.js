const request = require('superagent')
const Promise = require('bluebird')

const OrsUtil = require('./OrsUtil')
const orsUtil = new OrsUtil()

const Joi = require('joi')

const directionsSchema = require('../schemas/OrsDirectionsSchema')

const OrsDirections = function(args) {
  this.args = {}
  if ('api_key' in args) {
    this.args.api_key = args.api_key
  } else {
    console.log('Please add your openrouteservice api_key..')
  }
}

OrsDirections.prototype.clear = function() {
  for (let variable in this.args) {
    if (variable !== 'api_key') delete this.args[variable]
  }
}

OrsDirections.prototype.clearPoints = function() {
  if ('coordinates' in this.args) this.args.coordinates.length = 0
}

OrsDirections.prototype.addWaypoint = function(latlon) {
  if (!('coordinates' in this.args)) {
    this.args.coordinates = []
  }
  this.args.coordinates.push(latlon)
}

OrsDirections.prototype.getBody = function(args) {
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

OrsDirections.prototype.calculate = function(reqArgs) {
  orsUtil.copyProperties(reqArgs, this.args)
  const that = this

  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, directionsSchema, function(err, value) {
      if (err !== null) reject(new Error(err))

      const timeout = 10000
      that.args = value

      const requestSettings = orsUtil.prepareRequest(that.args, 'directions')

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
        .accept(requestSettings.meta.mimeType)
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
    })
  })
}

module.exports = OrsDirections
