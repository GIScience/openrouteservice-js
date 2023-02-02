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

    urlPathParts = urlPathParts.join('/')
    urlPathParts = urlPathParts.replace(/\/(\/)+/g, '/')

    // The beginning and end of urlPathParts can not be a slash
    if (urlPathParts[0] === '/') {
      urlPathParts = urlPathParts.slice(1)
    }
    let end = urlPathParts.slice(-1)
    if (end[0] === '/') {
      urlPathParts = urlPathParts.slice(0, -1)
    }

    url = url + '/' + urlPathParts

    return url
  }
}

export default OrsUtil
