import Constants from './constants'
import OrsBase from './OrsBase'

class OrsMatrix extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
      this.defaultArgs[Constants.propNames.service] = 'matrix'
    }
    if (!args[Constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = Constants.defaultAPIVersion
    }
  }
}

export default OrsMatrix
