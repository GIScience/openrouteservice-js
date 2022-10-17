import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsMatrix extends OrsBase {
  calculate(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'matrix'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = that.args[Constants.propNames.timeout] || 10000

      if (that.args[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        if (that.meta == null) {
          that.meta = orsUtil.prepareMeta(that.args)
        }
        that.httpArgs = orsUtil.prepareRequest(that.args)

        const url = orsUtil.prepareUrl(that.meta)
        const authorization = that.meta[Constants.propNames.apiKey]

        const orsRequest = request
          .post(url)
          .send(that.httpArgs)
          .set('Authorization', authorization)
          .timeout(timeout)

        for (const key in that.customHeaders) {
          orsRequest.set(key, that.customHeaders[key])
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
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsMatrix
