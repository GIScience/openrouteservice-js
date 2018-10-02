const OrsUtil = require('./OrsUtil.js')
const OrsInput = require('./OrsInput.js')
const OrsGeocode = require('./OrsGeocode.js')
const OrsIsochrones = require('./OrsIsochrones.js')
const OrsMatrix = require('./OrsMatrix.js')
const OrsDirections = require('./OrsDirections.js')
const OrsPois = require('./OrsPois.js')

const Openrouteservice = {
  Util: OrsUtil,
  Input: OrsInput,
  Geocode: OrsGeocode,
  Isochrones: OrsIsochrones,
  Directions: OrsDirections,
  Matrix: OrsMatrix,
  Pois: OrsPois
}

// define Openrouteservice for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports.Openrouteservice = Openrouteservice

  // define Openrouteservice as an AMD module
} else if (typeof define === 'function' && define.amd) {
  define(Openrouteservice)
}

if (typeof window !== 'undefined') {
  window.Openrouteservice = Openrouteservice
}
