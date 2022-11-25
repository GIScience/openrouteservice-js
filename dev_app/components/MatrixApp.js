import Openrouteservice from '@/index.js'

import blueIcon from './icons/blue_icon.png'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LTooltip} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip
  },
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      zoom: 15,
      center: {
        lat: 0,
        lon: 0
      },
      destinations: [],
      distance: [],

      json_title: '',
      json_data: {},

      data_ready: false,
      map_ready: false
    }
  },
  computed: {
    iconUrl() {
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
    const orsMatrix = new Openrouteservice.Matrix({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsMatrix.calculate({
        locations: [[8.690958, 49.404662], [8.687868, 49.390139], [8.687868, 49.390133]],
        profile: "driving-car",
        sources: ['all'],
        destinations: ['all']
      })
      this.json_title = 'Response'
      this.center = {
        lat: (response.destinations[0].location[1] + response.destinations[response.destinations.length - 1].location[1]) / 2,
        lon: (response.destinations[0].location[0] + response.destinations[response.destinations.length - 1].location[0]) / 2
      }
      for (let destination of response.destinations) {
        this.destinations.push(destination.location)
        this.distance.push(destination.snapped_distance)
      }
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true
  }
}
