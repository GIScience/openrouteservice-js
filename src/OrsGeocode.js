const request = require('superagent')
const Promise = require('bluebird')

const OrsUtil = require('./OrsUtil')
const orsUtil = new OrsUtil()

const Joi = require('joi')

const geocodeSchema = require('../schemas/geocode/OrsGeocodeSchema')
const reverseGeocodeSchema = require('../schemas/geocode/OrsReverseGeocodeSchema')
const structuredGeocodeSchema = require('../schemas/geocode/OrsStructuredGeocodeSchema')

let OrsGeocode = function(args) {
  this.args = {}
  if ('api_key' in args) {
    this.args.api_key = args.api_key
  } else {
    console.log('Please add your openrouteservice api_key...')
  }
}

OrsGeocode.prototype.clear = function() {
  for (let variable in this.args) {
    if (variable !== 'api_key') delete this.args[variable]
  }
}

OrsGeocode.prototype.getParametersAsQueryString = function(args) {
  let queryString = ''
  for (const key in args) {
    const val = args[key]
    if (key === 'host') continue
    else if (key === 'api_version') continue
    else if (key === 'mime_type') continue
    else queryString += this.lookupParameter[key](key, val)
  }
  return queryString
}

OrsGeocode.prototype.lookupParameter = {
  api_key: function(key, val) {
    return key + '=' + val
  },
  text: function(key, val) {
    return '&' + key + '=' + val
  },
  focus_point: function(key, val) {
    let urlParams = ''
    urlParams += '&' + 'focus.point.lon' + '=' + val[1]
    urlParams += '&' + 'focus.point.lat' + '=' + val[0]
    return urlParams
  },
  boundary_bbox: function(key, val) {
    let urlParams = ''
    urlParams += '&' + 'boundary.rect.min_lon' + '=' + val[0][1]
    urlParams += '&' + 'boundary.rect.min_lat' + '=' + val[0][0]
    urlParams += '&' + 'boundary.rect.max_lon' + '=' + val[1][1]
    urlParams += '&' + 'boundary.rect.max_lat' + '=' + val[1][0]

    return urlParams
  },
  point: function(key, val) {
    let urlParams = ''
    urlParams += '&' + 'point.lon' + '=' + val.lat_lng[1]
    urlParams += '&' + 'point.lat' + '=' + val.lat_lng[0]
    urlParams += '&' + 'boundary.circle.radius' + '=' + val.radius
    return urlParams
  },
  boundary_circle: function(key, val) {
    let urlParams = ''
    urlParams += '&' + 'boundary.circle.lon' + '=' + val.lat_lng[1]
    urlParams += '&' + 'boundary.circle.lat' + '=' + val.lat_lng[0]
    urlParams += '&' + 'boundary.circle.radius' + '=' + val.radius

    return urlParams
  },
  sources: function(key, val) {
    let urlParams = '&sources='
    for (source in val) {
      urlParams += source + ','
    }
    urlParams
    return urlParams
  },
  layers: function(key, val) {
    let urlParams = '&layers='
    let counter = 0
    for (key in val) {
      if (counter > 0) {
        urlParams += ','
      }
      urlParams += val[key]
      counter++
    }
    urlParams
    return urlParams
  },
  boundary_country: function(key, val) {
    let urlParams = '&' + 'boundary.country' + '=' + val
    return urlParams
  },
  size: function(key, val) {
    return '&' + key + '=' + val
  },
  address: function(key, val) {
    return '&' + key + '=' + val
  },
  neighbourhood: function(key, val) {
    return '&' + key + '=' + val
  },
  borough: function(key, val) {
    return '&' + key + '=' + val
  },
  locality: function(key, val) {
    return '&' + key + '=' + val
  },
  county: function(key, val) {
    return '&' + key + '=' + val
  },
  region: function(key, val) {
    return '&' + key + '=' + val
  },
  postalcode: function(key, val) {
    return '&' + key + '=' + val
  },
  country: function(key, val) {
    return '&' + key + '=' + val
  }
}

OrsGeocode.prototype.geocodePromise = function(schema) {
  const that = this
  console.log(that.args, schema)
  return new Promise(function(resolve, reject) {
    Joi.validate(that.args, schema, function(err, value) {
      console.log(true, err, value)

      if (err !== null) reject(new Error(err))

      const timeout = 5000
      that.args = value

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
    })
  })
}

OrsGeocode.prototype.geocode = function(reqArgs) {
  let url
  orsUtil.copyProperties(reqArgs, this.args)
  console.log(this)
  return this.geocodePromise(geocodeSchema)
}

OrsGeocode.prototype.reverseGeocode = function(reqArgs) {
  let url
  orsUtil.copyProperties(reqArgs, this.args)
  return this.geocodePromise(reverseGeocodeSchema)
}

OrsGeocode.prototype.structuredGeocode = function(reqArgs) {
  let url
  orsUtil.copyProperties(reqArgs, this.args)
  return this.geocodePromise(structuredGeocodeSchema)
}

module.exports = OrsGeocode
