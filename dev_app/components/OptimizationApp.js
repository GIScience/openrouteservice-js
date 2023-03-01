import Openrouteservice from '@/index.js'

import redIcon from "./icons/red_icon.png";
import blueIcon from './icons/blue_icon.png'
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
      zoom: 10,
      job_location: [],
      vehicle_routes: [],
      center: {
        lat: 0,
        lon: 0
      },
      routes: [],
      colorStyle: [
        {
          color: '#2b82cb'
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
    const orsOptimization = new Openrouteservice.Optimization({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    this.job_location = [
      [1.98935, 47.701],
      [2.03655, 47.61128],
      [2.39719, 48.07611]
    ]

    this.vehicle_routes = [
      // start and end point of one vehicle
      [[2.35044, 47.71764], [2.35044, 47.71764]]
    ]

    this.center = {
      lat: (this.vehicle_routes[0][1][1] + this.vehicle_routes[0][1][1]) / 2,
      lon: (this.vehicle_routes[0][1][0] + this.vehicle_routes[0][1][0]) / 2
    }

    let response = {}
    try {
      response = await orsOptimization.optimize({
        jobs: [
          {
            id: 1,
            service: 200,
            amount: [1],
            location: this.job_location[0],
            skills: [1]
          },
          {
            id: 2,
            service: 200,
            amount: [1],
            location: this.job_location[1],
            skills: [1]
          },
          {
            id: 3,
            service: 200,
            amount: [1],
            location: this.job_location[2],
            skills: [14]
          }
        ],
        vehicles: [
          {
            id: 1,
            profile: 'cycling-regular',
            start: this.vehicle_routes[0][0],
            end: this.vehicle_routes[0][1],
            capacity: [4],
            skills: [1, 14]
          }
        ]
      })
      this.json_title = 'Response'
      this.json_data = JSON.stringify(response, null, "\t")
      /*
      for(let i = 0; i < response.routes.length; i++) {
        for(let j = 1; j < response.routes[i]; j++) {
          this.routes.push(response.routes[i].steps[j].location)
        }
      }
      */
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true;
  }
}