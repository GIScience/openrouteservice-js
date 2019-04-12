import request from 'superagent'
import Promise from 'bluebird'
import Joi from 'joi'
import OrsUtil from './OrsUtil'
import poisSchema from './schemas/OrsPoisSchema'

const orsUtil = new OrsUtil()

class OrsPois {
  constructor(args) {
    this.args = {}
    if ('api_key' in args) {
      this.args.api_key = args.api_key
    } else {
      console.log('Please add your openrouteservice api_key...')
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

  poisPromise(schema) {
    const that = this
    return new Promise(function(resolve, reject) {
      Joi.validate(that.args, schema, function(err, value) {
        if (err !== null) reject(new Error(err))

        const timeout = 5000
        that.args = value

        const url = that.args.host + '?api_key=' + value.api_key

        const payload = that.generatePayload(that.args)

        request
          .post(url)
          .send(payload)
          .accept(that.args.mime_type)
          .timeout(timeout)
          .end(function(err, res) {
            //console.log(res.body, res.headers, res.status)
            if (err || !res.ok) {
              console.log(err)
              //reject(ghUtil.extractError(res, url));
              reject(new Error(err))
            } else if (res) {
              resolve(res.body)
            }
          })
      })
    })
  }

  pois(reqArgs) {
    orsUtil.copyProperties(reqArgs, this.args)

    return this.poisPromise(poisSchema)
  }
}

export default OrsPois
