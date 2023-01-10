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
    const orsPois = new Openrouteservice.Pois({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsPois.pois({
        geometry: {
          bbox: [[8.8034, 53.0756], [8.7834, 53.0456]],
          geojson: {
            type: "Point",
            coordinates: [8.8034, 53.0756]
          },
          buffer: 250
        },
        timeout: 20000
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