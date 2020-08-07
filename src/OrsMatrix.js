import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'

const orsUtil = new OrsUtil()

class OrsMatrix {
  constructor(args) {
    this.meta = null
    this.args = {}
    if (Constants.propNames.apiKey in args) {
      this.args[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.log(Constants.missingAPIKeyMsg)
    }
  }

  calculate(reqArgs) {
    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'matrix'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = 10000

      // eslint-disable-next-line prettier/prettier
      if (that.args[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        if (that.meta == null) {
          that.meta = orsUtil.prepareMeta(that.args)
        }
        that.httpArgs = orsUtil.prepareRequest(that.args)

        let url = orsUtil.prepareUrl(that.meta)
        let authorization = that.meta[Constants.propNames.apiKey]

        request
          .post(url)
          .send(that.httpArgs)
          .set('Authorization', authorization)
          // .set('Content-Type', that.meta.mimeType)
          // .accept('application/json')
          .timeout(timeout)
          .end(function(err, res) {
            if (err || !res.ok) {
              reject(err)
            } else if (res) {
              resolve(res.body)
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
