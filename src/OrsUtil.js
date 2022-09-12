import Constants from './constants.js'
class OrsUtil {
  fillArgs(defaultArgs, requestArgs) {
    requestArgs = {...defaultArgs, ...requestArgs}
    return requestArgs
  }

  saveArgsToCache(args) {
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
    delete args[Constants.propNames.timeout]
    return { ...args }
  }

  /**
   * Prepare the request url based on url constituents
   * @param {Object} args
   * @return {string} url
   */
  prepareUrl(args) {
    let url = args[Constants.propNames.host]
    let urlPathParts = [
      args[Constants.propNames.apiVersion],
      args[Constants.propNames.service],
      args[Constants.propNames.profile],
      args[Constants.propNames.format]
    ]

    urlPathParts = urlPathParts.join("/")
    urlPathParts = urlPathParts.replace(/\/(\/)+/g, "/")

    url = url + '/' + urlPathParts

    // The end of the url can not be a slash
    if (url.slice(-1) === '/') {
      url = url.slice(0, -1)
    }
    return url
  }

  /**
   * Set defaults for a request comparing and overwriting instance args
   * @param {Object} instanceArgs
   * @param {Object} requestArgs
   * @param {Boolean} setAPIVersion
   */
  setRequestDefaults(instanceArgs, requestArgs, setAPIVersion = false) {
    if (requestArgs[Constants.propNames.service]) {
      instanceArgs[Constants.propNames.service] = requestArgs[Constants.propNames.service]
    }
    if (requestArgs[Constants.propNames.host]) {
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
    return instanceArgs
  }
}

export default OrsUtil
