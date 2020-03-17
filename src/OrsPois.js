import request from 'superagent'
import Promise from 'bluebird'
import OrsUtil from './OrsUtil'

const orsUtil = new OrsUtil()

class OrsPois {
  constructor(args) {
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      // eslint-disable-next-line no-console
      console.error('Please add your openrouteservice api_key...')
    }
  }

  clear() {
    for (let variable in this.args) {
      if (variable !== 'api_key') delete this.args[variable]
    }
  }

  generatePayload(args) {
    let payload = {}

    for (const key in args) {
      if (
        key === 'host' ||
        key === 'api_version' ||
        key === 'mime_type' ||
        key === 'api_key'
      ) {
        continue
      } else {
        payload[key] = args[key]
      }
    }
    return payload
  }

  poisPromise() {
    if (!this.args.service) {
      this.args.service = 'pois'
    }
    if (!this.args.host) {
      this.args.host = 'https://api.openrouteservice.org'
    }
    const that = this
    return new Promise(function(resolve, reject) {
      const timeout = 5000

      let url = orsUtil.prepareUrl(that.args)

      const payload = that.generatePayload(that.args)

      request
        .post(url)
        .send(payload)
        // .accept(that.args.mime_type)
        .timeout(timeout)
        .end(function(err, res) {
          if (err || !res.ok) {
            // eslint-disable-next-line no-console
            console.error(err)
            reject(new Error(err))
          } else if (res) {
            resolve(res.body)
          }
        })
    })
  }

  pois(reqArgs) {
    orsUtil.copyProperties(reqArgs, this.args)

    return this.poisPromise()
  }
}

export default OrsPois
