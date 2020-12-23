import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'

const orsUtil = new OrsUtil()

class OrsMatrix {
  constructor(args) {
    this.meta = null
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      // eslint-disable-next-line no-console
      console.log('Please add your openrouteservice api_key..')
    }
  }

  calculate(reqArgs) {
    // Get custom header and remove from args
    this.customHeaders = []
    if (reqArgs.customHeaders) {
      this.customHeaders = reqArgs.customHeaders
      delete reqArgs.customHeaders
    }
    orsUtil.setRequestDefaults(this.args, reqArgs, true)
    // eslint-disable-next-line prettier/prettier
    if (!this.args[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      this.args[Constants.propNames.service] = 'matrix'
    }

    orsUtil.copyProperties(reqArgs, this.args)
    const that = this

    return new Promise(function(resolve, reject) {
      const timeout = 10000

      if (that.args.api_version === 'v2') {
        if (that.meta == null) {
          that.meta = orsUtil.prepareMeta(that.args)
        }
        that.httpArgs = orsUtil.prepareRequest(that.args)

        let url = orsUtil.prepareUrl(that.meta)

        let orsRequest = request
          .post(url)
          .send(that.httpArgs)
          .set('Authorization', authorization)
          .timeout(timeout)
          
          for (let key in that.customHeaders) {
            orsRequest.set(key, that.customHeaders[key])
          }
          orsRequest.end(function(err, res) {
            if (err || !res.ok) {
              console.error(err)
              reject(err)
            } else if (res) {
              resolve(res.body || res.text)
            }
          })
      } else {
        // eslint-disable-next-line no-console
        console.error('Please use ORS API v2')
      }
    })
  }
}

export default OrsMatrix
