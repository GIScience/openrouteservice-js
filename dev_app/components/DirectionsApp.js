import Openrouteservice from '@/index.js'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LGeoJson} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
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
      point: {
        start: [],
        end: []
      },
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
  methods: {},

  async mounted() {
    const orsDirections = new Openrouteservice.Directions({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    // add start and end point of your route here
    this.point.start = [8.690958, 49.404662]
    this.point.end = [8.687868, 49.390139]

    let response = {}
    try {
      response = await orsDirections.calculate({
        coordinates: [ this.point.start, this.point.end ],
        profile: "driving-car",
        extra_info: ["waytype", "steepness"],
        format: "geojson",
        api_version: 'v2'
      })
      this.json_title = 'Response'
      this.center = {
        lat: (response.bbox[1] + response.bbox[3])/2,
        lon: (response.bbox[0] + response.bbox[2])/2
      }
      this.geojson = response
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true;
  }
}