class OrsUtil {
  constructor() {}

  clone(obj) {
    let newObj = {}
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        newObj[prop] = obj[prop]
      }
    }
    return newObj
  }

  copyProperties(args, argsInto) {
    if (!args) return argsInto

    for (var prop in args) {
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
      host: args.host,
      apiVersion: args.api_version,
      profile: args.profile,
      format: args.format,
      service: args.service,
      apiKey: args.api_key,
      mimeType: args.mime_type
    }
  }

  prepareRequest(args) {
    delete args.mime_type
    delete args.host
    delete args.api_version
    delete args.profile
    delete args.format
    delete args.service
    delete args.api_key
    return { ...args }
  }

  prepareUrl(args) {
    let url = args.host || ''

    // make path
    let urlPathParts = [
      args.apiVersion,
      args.service,
      args.profile,
      args.format
    ]

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
}

export default OrsUtil
