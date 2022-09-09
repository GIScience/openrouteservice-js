import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsMatrix extends OrsBase {
  calculate(reqArgs) {
    this.checkHeaders(reqArgs)

    orsUtil.setRequestDefaults(this.defaultArgs, reqArgs, true)
    if (!this.defaultArgs[Constants.propNames.service] && !reqArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'matrix'
    }

    orsUtil.copyProperties(reqArgs, this.defaultArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.defaultArgs[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        if (that.meta == null) {
          that.meta = orsUtil.prepareMeta(that.defaultArgs)
        }
        that.httpArgs = orsUtil.prepareRequest(that.defaultArgs)

        that.createRequest(null, that.httpArgs, resolve, reject);
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsMatrix
