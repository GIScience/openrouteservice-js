const request = require('superagent')
const Promise = require('bluebird')

const OrsUtil = require('./OrsUtil')
const orsUtil = new OrsUtil()

const Joi = require('joi')

const isochronesSchema = require('../schemas/OrsIsochronesSchema')

const OrsIsochrones = function(args) {
  this.args = {}
  if ('api_key' in args) {
    this.args.api_key = args.api_key
  } else {
    console.log('Please add your openrouteservice api_key..')
  }
}

OrsIsochrones.prototype.addLocation = function(latlon) {
  if (!('locations' in this.args)) {
    this.args.locations = []
  }
  this.args.locations.push(latlon)
}

OrsIsochrones.prototype.getParametersAsQueryString = function(args) {
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

OrsIsochrones.prototype.flatParameter = function(key, val) {
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
      if (key === 'coordinates' || key === 'locations') {
        str += val[i][0] + ',' + val[i][1]
      } else {
        str += val[i]
      }
    }
  }

  return encodeURIComponent(key) + '=' + encodeURIComponent(str) + '&'
}

OrsIsochrones.prototype.calculate = function(reqArgs) {
  orsUtil.copyProperties(reqArgs, this.args)
  const that = this

  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, isochronesSchema, function(err, value) {
      if (err !== null) reject(new Error(err))

      const timeout = 10000
      that.args = value
      if (that.args.api_version === 'v1') {
        // use old API via GET
        let url = that.args.host + '?'
        url += that.getParametersAsQueryString(that.args)
        console.log(url)
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

module.exports = OrsIsochrones
