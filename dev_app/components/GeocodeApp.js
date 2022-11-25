import Openrouteservice from '@/index.js'

import blueIcon from './icons/blue_icon.png'
import redIcon from "./icons/red_icon.png";

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
      zoom: 7,
      center: {
        lat: 0,
        lon: 0
      },
      points: [],
      search: '',
      reversePoints: [],
      foundNames: [],

      json_title: '',
      json_data: {},
      json_data_reverse: {},

      data_ready: false,
      map_ready: false
    }
  },
  computed: {
    iconUrl() {
      return [
        blueIcon,
        redIcon
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

  // `mounted` is a lifecycle hook
  async mounted() {
    // `this` refers to the component instance.
    let geocode = new Openrouteservice.Geocode({api_key: import.meta.env.VITE_ORS_API_KEY})

    let response = await geocode.geocode({
      text: "Heidelberg",
      boundary_circle: {lat_lng: [49.412388, 8.681247], radius: 50},
      boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
      boundary_country: ["DE"]
    })

    let reverseResponse = await geocode.reverseGeocode({
      point: {
        lat_lng: [48.858268, 2.294471],
        radius: 1
      },
      size: 8
    })
    this.json_title = 'Response'

    this.center = {
      lat: (response.bbox[1] + response.bbox[3]) / 2,
      lon: (response.bbox[0] + response.bbox[2]) / 2
    }
    for (let feature of response.features) {
      this.points.push(feature.geometry.coordinates)
    }
    this.search = response.geocoding.query.text
    this.json_data = JSON.stringify(response, null, "\t")

    for (let feature of reverseResponse.features) {
      this.reversePoints.push(feature.geometry.coordinates)
      this.foundNames.push(feature.properties.name)
    }
    this.json_data_reverse = JSON.stringify(reverseResponse, null, "\t")

    // if we don't wait for the response it won't be available at the time it is tested
    // see: https://stackoverflow.com/questions/53513538/is-async-await-available-in-vue-js-mounted
    this.data_ready = true
    this.map_ready = true
  }
}
