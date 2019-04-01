import OrsUtil from './OrsUtil.js'
import OrsInput from './OrsInput.js'
import OrsGeocode from './OrsGeocode.js'
import OrsIsochrones from './OrsIsochrones.js'
import OrsMatrix from './OrsMatrix.js'
import OrsDirections from './OrsDirections.js'
import OrsPois from './OrsPois.js'
import OrsElevation from './OrsElevation.js'

const Openrouteservice = {
  Util: OrsUtil,
  Input: OrsInput,
  Geocode: OrsGeocode,
  Isochrones: OrsIsochrones,
  Directions: OrsDirections,
  Matrix: OrsMatrix,
  Pois: OrsPois,
  Elevation: OrsElevation
}

// define Openrouteservice for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Openrouteservice
  // define Openrouteservice as an AMD module
} else if (typeof define === 'function' && define.amd) {
  define(Openrouteservice)
}

if (typeof window !== 'undefined') {
  window.Openrouteservice = Openrouteservice
}