import request from 'superagent'
import OrsUtil from './OrsUtil'
import Constants from './constants'

const orsUtil = new OrsUtil()

class OrsBase {
  constructor(args) {
    this.defaultArgs = {}
    this.meta = null
    this.customHeaders = []

    if (Constants.propNames.apiKey in args) {
      this.defaultArgs[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.error(Constants.missingAPIKeyMsg)
      throw new Error(Constants.missingAPIKeyMsg)
    }

    if (Constants.propNames.host in args) {
      this.defaultArgs[Constants.propNames.host] = args[Constants.propNames.host]
    }
    if (Constants.propNames.service in args) {
      this.defaultArgs[Constants.propNames.service] = args[Constants.propNames.service]
    }
  }

  checkHeaders(reqArgs) {
    // Get custom header and remove from args
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
  }

  createRequest(url, body, resolve, reject) {
    let authorization = ""
    if (url === null) {
      url = orsUtil.prepareUrl(this.meta)
      authorization = this.meta[Constants.propNames.apiKey]
    } else {
      authorization = this.defaultArgs[Constants.propNames.apiKey]
    }

    const timeout = this.defaultArgs[Constants.propNames.timeout] || 10000

    const orsRequest = request
      .post(url)
      .send(body)
      .set('Authorization', authorization)
      .timeout(timeout)

    for (const key in this.customHeaders) {
      orsRequest.set(key, this.customHeaders[key])
    }
    orsRequest.end(function(err, res) {
      if (err || !res.ok) {
        // eslint-disable-next-line no-console
        console.error(err)
        reject(err)
      } else if (res) {
        resolve(res.body || res.text)
      }
    })
  }
}

export default OrsBase
