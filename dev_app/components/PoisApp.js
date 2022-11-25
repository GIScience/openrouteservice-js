import Openrouteservice from '@/index.js'

import redIcon from './icons/red_icon.png'
import blueIcon from './icons/blue_icon.png'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LTooltip} from "@vue-leaflet/vue-leaflet";
import greenIcon from "./icons/green_icon.png";

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
      zoom: 18,
      coordinates: [],
      center: {
        lat: 0,
        lon: 0
      },
      pois: [],
      poi_names: [],

      json_title: '',
      json_data: {},
      data_ready: false,
      map_ready: false
    }
  },
  computed: {
    iconUrl() {
      return [
        redIcon,
        blueIcon,
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
      for (const feat of response.features) {
        this.pois.push([
          feat.geometry.coordinates[1],
          feat.geometry.coordinates[0]
        ])
        if (feat.properties?.osm_tags?.name) {
          this.poi_names.push(feat.properties.osm_tags.name)
        } else {
          this.poi_names.push('(name unknown)')
        }
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
