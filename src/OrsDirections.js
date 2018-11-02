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

OrsDirections.prototype.getParametersAsQueryString = function(args) {
  let queryString = ''
  for (const key in args) {
    const val = args[key]
    if (key === 'host') continue
    else if (key === 'api_version') continue
    else if (key === 'mime_type') continue
    else queryString += this.flatParameter(key, val)
  }
  return queryString
}

OrsDirections.prototype.flatParameter = function(key, val) {
  let str = val

  if (orsUtil.isObject(val)) {
    // arr = Object.keys(val);
    // for (keyIndex in arr) {
    //     var objKey = arr[keyIndex];
    //     url += this.flatParameter(key + "." + objKey, val[objKey]);
    // }
    // return url;
  } else if (orsUtil.isArray(val)) {
    str = ''

    let i, l
    for (i = 0, l = val.length; i < l; i++) {
      if (i > 0) str += '|'
      if (key === 'coordinates') {
        str += val[i][0] + ',' + val[i][1]
      } else {
        str += val[i]
      }
    }
  }

  return encodeURIComponent(key) + '=' + encodeURIComponent(str) + '&'
}

OrsDirections.prototype.calculate = function(reqArgs) {
  let url
  orsUtil.copyProperties(reqArgs, this.args)
  const that = this

  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, directionsSchema, function(err, value) {
      if (err !== null) reject(new Error(err))

      const timeout = 10000
      that.args = value
      if (that.args.api_version === 'v1') {
        // use old API via GET
        let url = that.args.host + '?'
        url += that.getParametersAsQueryString(that.args)
        //console.log(url)
        request
          .get(url)
          .accept(that.args.mime_type)
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
      } else if (that.args.api_version === 'v2') {
        // use new API via POST
      }
    })
  })
}

module.exports = OrsDirections
