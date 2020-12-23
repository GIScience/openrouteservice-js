import Constants from './constants'
class OrsUtil {
  clone(obj) {
    let newObj = {}
    for (var prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        newObj[prop] = obj[prop]
      }
    }
    return newObj
  }

  copyProperties(args, argsInto) {
    if (!args) return argsInto

    for (var prop in args) {
      // eslint-disable-next-line no-prototype-builtins
      if (args.hasOwnProperty(prop) && args[prop] !== undefined) {
        argsInto[prop] = args[prop]
      }
    }
    return argsInto
  }

  extractError(res, url) {
    let msg

    if (res && res.body) {
      msg = res.body
      if (msg.message) msg = msg.message
    } else {
      msg = res
    }

    return new Error(msg + ' - for url ' + url)
  }

  isArray(value) {
    let stringValue = Object.prototype.toString.call(value)
    return stringValue.toLowerCase() === '[object array]'
  }

  isObject(value) {
    let stringValue = Object.prototype.toString.call(value)
    return stringValue.toLowerCase() === '[object object]'
  }

  isString(value) {
    return typeof value === 'string'
  }

  prepareMeta(args) {
    return {
      host: args[Constants.propNames.host],
      api_version: args[Constants.propNames.apiVersion],
      profile: args[Constants.propNames.profile],
      format: args[Constants.propNames.format],
      service: args[Constants.propNames.service],
      api_key: args[Constants.propNames.apiKey],
      mime_type: args[Constants.propNames.mimeType]
    }
  }

  prepareRequest(args) {
    delete args[Constants.propNames.mimeType]
    delete args[Constants.propNames.host]
    delete args[Constants.propNames.apiVersion]
    delete args[Constants.propNames.service]
    delete args[Constants.propNames.apiKey]
    delete args[Constants.propNames.profile]
    delete args[Constants.propNames.format]
    return { ...args }
  }

  /**
   * Prepare the request url based on url constituents
   * @param {Objet} args
   */
  prepareUrl(args) {
    let url = ''

    // make path
    let urlPathParts = []

    // If the service already defines the path
    // to the request service we have to add
    // only yhe profile and the format to the url
    // eslint-disable-next-line prettier/prettier
    if (args[Constants.propNames.service] && args[Constants.propNames.service].indexOf('http') === 0) {
      url = args[Constants.propNames.service]
      urlPathParts = [
        args[Constants.propNames.profile],
        args[Constants.propNames.format]
      ]
    } else {
      // if not, build the url from scratch
      url = args[Constants.propNames.host]
      urlPathParts = [
        args[Constants.propNames.apiVersion],
        args[Constants.propNames.service],
        args[Constants.propNames.profile],
        args[Constants.propNames.format]
      ]
    }

    let urlPath = '/'
    let counter = 0
    for (let key in urlPathParts) {
      if (urlPathParts[key]) {
        if (counter > 0 && counter) {
          urlPath += '/'
        }
        urlPath += urlPathParts[key]
      }
      counter++
    }

    // Remove double slashs from path
    let cleanUrlPath = urlPath.replace(/\/\//g, '/')
    url += cleanUrlPath

    // The end of the url can not be a slash
    if (url.slice(-1) === '/') {
      url = url.slice(0, -1)
    }
    return url
  }

  /**
   * Set defaults for a request comparing and posibly overwritting instance args
   * @param {Object} instanceArgs
   * @param {Object} requestArgs
   * @param {Boolean} setAPIVersion
   */
  setRequestDefaults(instanceArgs, requestArgs, setAPIVersion = false) {
    if (requestArgs[Constants.propNames.service]) {
      // eslint-disable-next-line prettier/prettier
      instanceArgs[Constants.propNames.service] = requestArgs[Constants.propNames.service]
    }
    if (requestArgs[Constants.propNames.host]) {
      // eslint-disable-next-line prettier/prettier
      instanceArgs[Constants.propNames.host] = requestArgs[Constants.propNames.host]
    }
    if (!instanceArgs[Constants.propNames.host]) {
      instanceArgs[Constants.propNames.host] = Constants.defaultHost
    }
    if (setAPIVersion === true) {
      if (!requestArgs[Constants.propNames.apiVersion]) {
        requestArgs.api_version = Constants.defaultAPIVersion
      }
      if (!requestArgs[Constants.propNames.apiVersion]) {
        requestArgs.api_version = Constants.defaultAPIVersion
      }
    }
  }
}

export default OrsUtil
