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
    if (!reqArgs.service) {
      reqArgs.service = 'matrix'
    }
    if (!reqArgs.host) {
      reqArgs.host = 'https://api.openrouteservice.org'
    }
    if (!reqArgs.api_version) {
      reqArgs.api_version = 'v2'
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

        request
          .post(url)
          .send(that.httpArgs)
          .set('Authorization', that.meta.apiKey)
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
        console.error('Please use ORS API v2')
      }
    })
  }
}

export default OrsMatrix
