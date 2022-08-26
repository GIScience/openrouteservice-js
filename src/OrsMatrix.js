import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsMatrix extends OrsBase {
  calculate(reqArgs) {
    this.checkHeaders(reqArgs)

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

        that.createRequest(null, that.httpArgs, resolve, reject);
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsMatrix
