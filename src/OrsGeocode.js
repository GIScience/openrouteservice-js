import OrsUtil from './OrsUtil.js'
import Constants from './constants.js'
import OrsBase from './OrsBase.js'

const orsUtil = new OrsUtil()

class OrsGeocode extends OrsBase {
  constructor(args) {
    super(args)

    this.lookupParameter = {
      api_key: function (key, val) {
        return key + '=' + val
      },
      text: function (key, val) {
        return '&' + key + '=' + encodeURIComponent(val)
      },
      focus_point: function (key, val) {
        let urlParams = ''
        urlParams += '&' + 'focus.point.lon' + '=' + val[1]
        urlParams += '&' + 'focus.point.lat' + '=' + val[0]
        return urlParams
      },
      boundary_bbox: function (key, val) {
        let urlParams = ''
        urlParams += '&' + 'boundary.rect.min_lon' + '=' + val[0][1]
        urlParams += '&' + 'boundary.rect.min_lat' + '=' + val[0][0]
        urlParams += '&' + 'boundary.rect.max_lon' + '=' + val[1][1]
        urlParams += '&' + 'boundary.rect.max_lat' + '=' + val[1][0]

        return urlParams
      },
      point: function (key, val) {
        if (val && Array.isArray(val.lat_lng)) {
          let urlParams = ''
          urlParams += '&' + 'point.lon' + '=' + val.lat_lng[1]
          urlParams += '&' + 'point.lat' + '=' + val.lat_lng[0]
          return urlParams
        }
      },
      boundary_circle: function (key, val) {
        let urlParams = ''
        urlParams += '&' + 'boundary.circle.lon' + '=' + val.lat_lng[1]
        urlParams += '&' + 'boundary.circle.lat' + '=' + val.lat_lng[0]
        urlParams += '&' + 'boundary.circle.radius' + '=' + val.radius

        return urlParams
      },
      sources: function (key, val) {
        let urlParams = '&sources='
        if (val) {
          for (const key in val) {
            if (Number(key) > 0) {
              urlParams += ','
            }
            urlParams += val[key]
          }
          return urlParams
        }
      },
      layers: function (key, val) {
        let urlParams = '&layers='
        let counter = 0
        for (key in val) {
          if (counter > 0) {
            urlParams += ','
          }
          urlParams += val[key]
          counter++
        }
        return urlParams
      },
      boundary_country: function (key, val) {
        return '&' + 'boundary.country' + '=' + val
      },
      size: function (key, val) {
        return '&' + key + '=' + val
      },
      address: function (key, val) {
        return '&' + key + '=' + val
      },
      neighbourhood: function (key, val) {
        return '&' + key + '=' + val
      },
      borough: function (key, val) {
        return '&' + key + '=' + val
      },
      locality: function (key, val) {
        return '&' + key + '=' + val
      },
      county: function (key, val) {
        return '&' + key + '=' + val
      },
      region: function (key, val) {
        return '&' + key + '=' + val
      },
      postalcode: function (key, val) {
        return '&' + key + '=' + val
      },
      country: function (key, val) {
        return '&' + key + '=' + val
      }
    }
  }

  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== Constants.propNames.apiKey) delete this.defaultArgs[variable]
    }
  }

  getParametersAsQueryString(args) {
    let queryString = ''
    for (const key in args) {
      const val = args[key]
      if (Constants.baseUrlConstituents.indexOf(key) <= -1) {
        queryString += this.lookupParameter[key](key, val)
      }
    }
    return queryString
  }

  async geocodePromise() {
    // Use old API via GET
    let url = orsUtil.prepareUrl(this.requestArgs)
    // Add url query string from args
    url += '?' + this.getParametersAsQueryString(this.requestArgs)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort('timed out'), this.defaultArgs[Constants.propNames.timeout] || 5000)

    try {
      // createRequest function from base class is not applicable: GET instead of POST request
      const orsRequest = await fetch(url, {
        method: 'GET',
        headers: this.customHeaders,
        signal: controller.signal
      })

      if (!orsRequest.ok) {
        throw {
          status: orsRequest.status,
          message: orsRequest.statusText
        }
      }
      return await orsRequest.json() || orsRequest.text
    } catch (err) {
      const error = new Error(err.message)
      error.status = err.status

      console.error(error)
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  async geocode(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs.service = 'geocode/search'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.geocodePromise()
  }

  async reverseGeocode(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs.service = 'geocode/reverse'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.geocodePromise()
  }

  async structuredGeocode(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.requestArgs.service = 'geocode/search/structured'
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs)

    return await this.geocodePromise()
  }
}

export default OrsGeocode
