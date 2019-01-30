const request = require('superagent')
const Promise = require('bluebird')

const OrsUtil = require('./OrsUtil')
const orsUtil = new OrsUtil()

const Joi = require('joi')

const matrixSchema = require('../schemas/OrsMatrixSchema')

const OrsMatrix = function(args) {
  this.args = {}
  if ('api_key' in args) {
    this.args.api_key = args.api_key
  } else {
    console.log('Please add your openrouteservice api_key..')
  }
}

OrsMatrix.prototype.clearPoints = function() {
  if ('coordinates' in this.args) this.args.coordinates.length = 0
}

OrsMatrix.prototype.addWaypoint = function(latlon) {
  if (!('coordinates' in this.args)) {
    this.args.coordinates = []
  }
  this.args.coordinates.push(latlon)
}

OrsMatrix.prototype.calculate = function(reqArgs) {
  orsUtil.copyProperties(reqArgs, this.args)
  const that = this

  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, matrixSchema, function(err, value) {
      if (err !== null) reject(new Error(err))

      const timeout = 10000
      that.args = value
      if (that.args.api_version === 'v2') {
        const requestSettings = orsUtil.prepareRequest(that.args, 'matrix')

        const url = [
          requestSettings.meta.host,
          requestSettings.meta.apiVersion,
          requestSettings.meta.service,
          requestSettings.meta.profile,
          requestSettings.meta.format
        ].join('/')

        request
          .post(url)
          .send(requestSettings.httpArgs)
          .set('Authorization', requestSettings.meta.apiKey)
          .set('Content-Type', requestSettings.meta.mimeType)
          .accept('application/json')
          .timeout(timeout)
          .end(function(err, res) {
            //console.log(res.body, res.headers, res.status)
            if (err || !res.ok) {
              console.log(err)
              reject(new Error(err))
            } else if (res) {
              resolve(res.body)
            }
          })
      }
    })
  })
}

module.exports = OrsMatrix
