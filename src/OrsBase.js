import Constants from './constants'

class OrsBase {
  constructor(args) {
    this.args = {}
    this.meta = null

    if (Constants.propNames.apiKey in args) {
      this.args[Constants.propNames.apiKey] = args[Constants.propNames.apiKey]
    } else {
      // eslint-disable-next-line no-console
      console.error(Constants.missingAPIKeyMsg)
      throw new Error(Constants.missingAPIKeyMsg)
    }

    if (Constants.propNames.host in args) {
      this.args[Constants.propNames.host] = args[Constants.propNames.host]
    }
    if (Constants.propNames.service in args) {
      this.args[Constants.propNames.service] = args[Constants.propNames.service]
    }
  }
}

export default OrsBase
