import Constants from './constants.js'
import OrsBase from './OrsBase.js'

class OrsSnap extends OrsBase {
    constructor(args) {
        super(args);
        if (!this.defaultArgs[Constants.propNames.service] && !this.requestArgs[Constants.propNames.service]) {
            this.defaultArgs[Constants.propNames.service] = 'snap'
        }
        if (!args[Constants.propNames.apiVersion]) {
            this.defaultArgs.api_version = Constants.defaultAPIVersion
        }
    }
}

export default OrsSnap
