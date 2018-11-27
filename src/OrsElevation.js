const request = require('superagent')
const Promise = require('bluebird')

const OrsUtil = require('./OrsUtil')
const orsUtil = new OrsUtil()

const Joi = require('joi')

const elevationLineSchema = require('../schemas/elevation/OrsLineElevationSchema.js')
const elevationPointSchemaSchema = require('../schemas/elevation/OrsPointElevationSchema.js')

let OrsElevation = function(args) {
  this.args = {}
  if ('api_key' in args) {
    this.args.api_key = args.api_key
  } else {
    console.log('Please add your openrouteservice api_key...')
  }
}

OrsElevation.prototype.clear = function() {
  for (let variable in this.args) {
    if (variable !== 'api_key') delete this.args[variable]
  }
}

OrsElevation.prototype.generatePayload = function(args) {
  let payload = {}

  for (const key in args) {
    if (
      key === 'host' ||
      key === 'api_version' ||
      key === 'mime_type' ||
      key === 'api_key'
    ) {
      continue
    } else {
      payload[key] = args[key]
    }
  }
  return payload
}

OrsElevation.prototype.elevationPromise = function(schema) {
  const that = this

  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, schema, function(err, value) {
      //console.log(true, err, value)

      if (err !== null) reject(new Error(err))

      const timeout = 5000
      that.args = value

      const url = that.args.host + '?api_key=' + value.api_key

      const payload = that.generatePayload(that.args)

      request
        .post(url)
        .send(payload)
        .accept(that.args.mime_type)
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
    })
  })
}

OrsElevation.prototype.lineElevation = function(reqArgs) {
  orsUtil.copyProperties(reqArgs, this.args)
  return this.elevationPromise(elevationLineSchema)
}

OrsElevation.prototype.pointElevation = function(reqArgs) {
  orsUtil.copyProperties(reqArgs, this.args)
  return this.elevationPromise(elevationPointSchemaSchema)
}

module.exports = OrsElevation
