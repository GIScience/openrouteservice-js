import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'

const orsUtil = new OrsUtil()

class OrsGeocode {
  constructor(args) {
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      // eslint-disable-next-line no-console
      console.error('Please add your openrouteservice api_key...')
    }

    this.lookupParameter = {
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
        for (let source in val) {
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
  }

  clear() {
    for (let variable in this.args) {
      if (variable !== 'api_key') delete this.args[variable]
    }
  }

  getParametersAsQueryString(args) {
    let queryString = ''
    for (const key in args) {
      const val = args[key]
      if (key === 'host') continue
      if (key === 'service') continue
      else if (key === 'api_version') continue
      else if (key === 'mime_type') continue
      else queryString += this.lookupParameter[key](key, val)
    }
    return queryString
  }

  geocodePromise() {
    if (!this.args.host) {
      this.args.host = 'https://api.openrouteservice.org'
    }
    const that = this
    return new Promise(function(resolve, reject) {
      const timeout = 5000

      // Use old API via GET
      let url = orsUtil.prepareUrl(that.args)

      // Add url query string from args
      url += '?' + that.getParametersAsQueryString(that.args)

      request
        .get(url)
        .accept(that.args.mime_type)
        .timeout(timeout)
        .end(function(err, res) {
          if (err || !res.ok) {
            // eslint-disable-next-line no-console
            console.error(err)
            reject(new Error(err))
          } else if (res) {
            resolve(res.body)
          }
        })
    })
  }

  geocode(reqArgs) {
    if (!reqArgs.service) {
      reqArgs.service = 'geocode/search'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.geocodePromise()
  }

  reverseGeocode(reqArgs) {
    if (!reqArgs.service) {
      reqArgs.service = 'geocode/reverse'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.geocodePromise()
  }

  structuredGeocode(reqArgs) {
    if (!reqArgs.service) {
      reqArgs.service = 'geocode/search/structured'
    }
    orsUtil.copyProperties(reqArgs, this.args)
    return this.geocodePromise()
  }
}

export default OrsGeocode
