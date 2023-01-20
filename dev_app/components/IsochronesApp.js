import Openrouteservice from '@/index.js'

import blueIcon from './icons/blue_icon.png'
import redIcon from './icons/red_icon.png'
import greenIcon from './icons/green_icon.png'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LGeoJson} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LGeoJson
  },
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      zoom: 13,
      points: [],
      extent: 600,
      isochrones: [],
      center: {
        lat: 0,
        lon: 0
      },
      geojson: {},
      hueStyle: [],
      iso: [],


      json_title: '',
      json_data: {},
      data_ready: false,
      map_ready: false

    }
  },
  computed: {
    blueIconUrl() {
      return blueIcon
    },
    iconSize() {
      return [25, 41]
    },
    iconAnchor() {
      return [15, 41]
    }
  },
  methods: {},

  async mounted() {
    const orsIsochrones = new Openrouteservice.Isochrones({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    // add center point for isochrones here
    this.points = [[8.681495, 49.41461]]

    for (let i = 0; i < (this.extent / 100); i++) {
      let z = i + 1
      this.isochrones[i] = z * 100;
    }

    let response = {}
    try {
      response = await orsIsochrones.calculate({
        profile: 'driving-car',
        locations: this.points,
        range: this.isochrones,
        area_units: 'km',
        format: 'geojson'
      })
      this.json_title = 'Response'
      this.center = {
        lat: (response.bbox[1] + response.bbox[3]) / 2,
        lon: (response.bbox[0] + response.bbox[2]) / 2
      }
      // code to style isochrones
      // divide response.features into the same amount of arrays as points requested, here: two
      if (this.points.length <= 2) {
        this.iso = [
          response.features.slice(0, response.features.length / this.points.length),
          response.features.slice(this.iso[0], response.features.length / this.points.length)
        ]
      }

      // isochrones styled by changing opacity
      if (this.points.length > 1) {
        this.color_style = true
      // isochrones styled by changing hue, push different hues to the hueStyle array
      } else {
        let i = 0
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(155, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(95, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(55, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(25, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(360, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(315, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(230, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(240, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
          i++
        }
        if (i < this.iso[0].length) {
          this.hueStyle.push({
            style: {
              color: 'hsl(180, 100%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
        } else {
          this.hueStyle.push({
            style: {
              color: 'hsl(0, 0%, 40%)',
              opacity: 0.3,
              fillOpacity: 0.2,
              weight: 3
            }
          })
        }
        this.hue_style = true
      }

      this.geojson = response
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true
  }
}