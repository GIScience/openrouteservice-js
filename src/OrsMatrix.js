import Promise from 'bluebird'
import OrsUtil from './OrsUtil'
import Constants from './constants'
import OrsBase from './OrsBase'

const orsUtil = new OrsUtil()

class OrsMatrix extends OrsBase {
  calculate(reqArgs) {
    this.requestArgs = reqArgs

    this.checkHeaders()

    orsUtil.setRequestDefaults(this.defaultArgs, this.requestArgs, true)
    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'matrix'
    }

    this.requestArgs = orsUtil.fillArgs(this.defaultArgs,this.requestArgs)

    const that = this
    return new Promise(function(resolve, reject) {
      if (that.requestArgs[Constants.propNames.apiVersion] === Constants.defaultAPIVersion) {
        that.argsCache = orsUtil.saveArgsToCache(that.requestArgs)

        that.httpArgs = orsUtil.prepareRequest(that.requestArgs)

        that.createRequest(null, that.httpArgs, resolve, reject);
      } else {
        // eslint-disable-next-line no-console
        console.error(Constants.useAPIV2Msg)
      }
    })
  }
}

export default OrsMatrix
