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
    },
    points: {
      type: Array,
      required: false,
      default: [[8.681495, 49.41461], [8.686507, 49.41943], [8.69059, 49.37818]]
    }
  },
  data() {
    return {
      zoom: 13,
      extent: [600],
      center: {
        lat: 0,
        lon: 0
      },
      geojson: {},
      colorStyle: [
        {
          color: '#2b82cb',
          opacity: 0.3,
          fillOpacity: 0.2,
          weight: 3
        },
        {
          color: '#c3577a',
          opacity: 0.3,
          fillOpacity: 0.2,
          weight: 3
        },
        {
          color: '#298f57',
          opacity: 0.3,
          fillOpacity: 0.2,
          weight: 3
        }
      ],
      hueStyle: [],
      iso: [],
      hueColorMap:[155,95,55,25,360,315,230,240,180,0],


      json_title: '',
      json_data: {},
      color_style: false,
      hue_style: false,
      data_ready: false,
      map_ready: false

    }
  },
  computed: {
    iconUrl() {
      return [
        blueIcon,
        redIcon,
        greenIcon
      ]
    },
    iconSize() {
      return [25, 41]
    },
    iconAnchor() {
      return [15, 41]
    }
  },
  methods: {
    getHueStyle(i) {
      return {
        color: `hsl(${this.hueColorMap[i]}, 100%, 40%)`,
        opacity: 0.3,
        fillOpacity: 0.2,
        weight: 3
      }
    }
  },

  async mounted() {
    const orsIsochrones = new Openrouteservice.Isochrones({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsIsochrones.calculate({
        profile: 'driving-car',
        locations: this.points,
        range: this.extent,
        interval: this.extent[0] /6,
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
      this.iso = [
        response.features.slice(0, response.features.length / this.points.length)
      ]
      for (let i = 1; i < this.points.length; i++) {
        let start = i * this.iso[0].length
        this.iso.push(response.features.slice(start, start + response.features.length / this.points.length))
      }

      if (this.points.length > 1) {
        this.color_style = true
      } else {
        // isochrones styled by changing hue, push different hues to the hueStyle array
        let i = 0
        while (i < this.iso[0].length) {
          this.hueStyle.push(this.getHueStyle(i))
          i++
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
