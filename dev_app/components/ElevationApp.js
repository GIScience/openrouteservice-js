import Openrouteservice from '@/index.js'

import blueIcon from './icons/blue_icon.png'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LTooltip, LPolyline} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip,
    LPolyline
  },
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      zoom: 18,
      center: {
        lat: 0,
        lon: 0
      },
      linestring: [],
      height: [],
      colorStyle: {
        color: '#2b82cb'
      },

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
    const orsElevation = new Openrouteservice.Elevation({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsElevation.lineElevation({
        format_in: "encodedpolyline",
        geometry: "u`rgFswjpAKD"
      })
      this.json_title = 'Response'
      for (let c of response.geometry.coordinates) {
        this.linestring.push([c[1], c[0]])
        this.height.push(c[2])
      }
      this.center = {
        lat: (response.geometry.coordinates[0][1] + response.geometry.coordinates[1][1]) / 2,
        lon: (response.geometry.coordinates[0][0] + response.geometry.coordinates[1][0]) / 2
      }
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true;
  }
}
