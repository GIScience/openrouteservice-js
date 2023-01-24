import Openrouteservice from '@/index.js'

import redIcon from './icons/red_icon.png'

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
      zoom: 17,
      coordinates: [],
      center: {
        lat: 0,
        lon: 0
      },
      geojson: {},

      json_title: '',
      json_data: {},
      data_ready: false,
      map_ready: false
    }
  },
  computed: {
    redIconUrl() {
      return redIcon
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
    const orsPois = new Openrouteservice.Pois({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    // add coordinates of requested point here
    this.coordinates = [8.8034, 53.0756]

    let response = {}
    try {
      response = await orsPois.pois({
        geometry: {
          bbox: [[8.8034, 53.0756], [8.7834, 53.0456]],
          geojson: {
            type: "Point",
            coordinates: this.coordinates
          },
          buffer: 250
        },
        timeout: 20000
      })
      this.json_title = 'Response'
      this.center = {
        lat: (response.bbox[1] + response.bbox[3]) / 2,
        lon: (response.bbox[0] + response.bbox[2]) / 2
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