const constants = {
  defaultAPIVersion: 'v2',
  defaultHost: 'https://api.openrouteservice.org',
  missingAPIKeyMsg: 'Please add your openrouteservice api_key..',
  useAPIV2Msg: 'Please use ORS API v2',
  baseUrlConstituents: ['host', 'service', 'api_version', 'mime_type'],
  propNames: {
    apiKey: 'api_key',
    host: 'host',
    service: 'service',
    apiVersion: 'api_version',
    mimeType: 'mime_type',
    profile: 'profile',
    format: 'format',
    timeout: 'timeout'
  }
}

export default constants
