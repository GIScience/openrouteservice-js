import Openrouteservice from '@/index.js'

import redIcon from "./icons/red_icon.png";
import blueIcon from './icons/blue_icon.png'
import greenIcon from './icons/green_icon.png'

import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LTooltip, LGeoJson} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip,
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
      vehicle_routes: [],
      req_args: {
        profile: 'cycling-regular'
      },
      center: {
        lat: 0,
        lon: 0
      },
      jobs: [],
      geojson: [],
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
    const orsDirections = new Openrouteservice.Directions({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    this.vehicle_routes = [
      // start and end point of one vehicle
      [[2.35044, 47.71764], [2.35044, 47.71764]]
    ]

    let response = {}
    try {
      response = await orsOptimization.optimize({
        jobs: [
          {
            id: 1,
            service: 200,
            amount: [1],
            location: [1.98935, 47.701],
            skills: [1]
          },
          {
            id: 2,
            service: 200,
            amount: [1],
            location: [2.03655, 47.61128],
            skills: [1]
          },
          {
            id: 3,
            service: 200,
            amount: [1],
            location: [2.39719, 48.07611],
            skills: [14]
          }
        ],
        vehicles: [
          {
            id: 1,
            profile: this.req_args.profile,
            start: this.vehicle_routes[0][0],
            end: this.vehicle_routes[0][1],
            capacity: [4],
            skills: [1, 14]
          }
        ]
      })
      this.json_title = 'Response'
      this.json_data = JSON.stringify(response, null, "\t")
      for (const routeIndex in response.routes) {
        this.jobs.push([])
        for (let step of response.routes[routeIndex].steps) {
          this.jobs[routeIndex].push(step.location)
        }

        let routing = await orsDirections.calculate({
          coordinates: this.jobs[routeIndex],
          profile: this.req_args.profile,
          format: "geojson"
        })
        if (routeIndex === '0') {
          this.center = {
            lat: (routing.bbox[1] + routing.bbox[3]) / 2,
            lon: (routing.bbox[0] + routing.bbox[2]) / 2
          }
        }
        this.geojson[routeIndex] = routing

        this.jobs[routeIndex] = this.jobs[routeIndex].slice(1, -1)
      }

    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
    this.map_ready = true;
  }
}
