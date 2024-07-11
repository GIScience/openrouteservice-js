import Openrouteservice from '@/index.js'

import blueIcon from './icons/blue_icon.png'
import redIcon from "./icons/red_icon.png";
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
      zoom: 14,
      route: [],
      center: {
        lat: 0,
        lon: 0
      },
      geojson: [],
      colorStyle: [
        {
          color: '#2b82cb'
        },
        {
          color: '#c3577a'
        },
        {
          color: '#298f57'
        }
      ],


      json_title: '',
      json_data: {},

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
  methods: {},

  async mounted() {
    const orsDirections = new Openrouteservice.Directions({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    // add start and end points of your route here
    this.route = [
      [[8.690958, 49.404662], [8.687868, 49.390139]],
      [[8.660958, 49.404662], [8.685868, 49.380139]]
    ]

    let response = {}
    try {
      response = await orsDirections.calculate({
        coordinates: this.route[0],
        profile: "driving-car",
        extra_info: ["waytype", "steepness"],
        format: "geojson",
        api_version: 'v2'
      })
      this.json_title = 'Response'
      this.center = {
        lat: (response.bbox[1] + response.bbox[3]) / 2,
        lon: (response.bbox[0] + response.bbox[2]) / 2
      }
      this.geojson[0] = response
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    try {
      response = await orsDirections.calculate({
        coordinates: this.route[1],
        profile: "driving-car",
        extra_info: ["waytype", "steepness"],
        format: "geojson",
        api_version: 'v2'
      })
      this.geojson[1] = response
      this.json_data += ' Route 2: ' + JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true;
  }
}