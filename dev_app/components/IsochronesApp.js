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
    const orsIsochrones = new Openrouteservice.Isochrones({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsIsochrones.calculate({
        profile: 'driving-car',
        locations: [[8.681495, 49.41461], [8.686507, 49.41943]],
        range: [300, 200],
        area_units: 'km'
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