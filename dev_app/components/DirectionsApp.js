import Openrouteservice from '@/index.js'

export default {
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      json_title: '',
      json_data: {},
      data_ready: false
    }
  },
  methods: {},

  async mounted() {
    const orsDirections = new Openrouteservice.Directions({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsDirections.calculate({
        coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
        profile: "driving-car",
        extra_info: ["waytype", "steepness"],
        api_version: 'v2',
        customHeaders: {'Accept': 'application/json'}
      })
      this.json_title = 'Response'
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
  }
}