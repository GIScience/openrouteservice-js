import Openrouteservice from '@'

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
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_title = 'Error'
      this.json_data = JSON.stringify(e, null, "\t")
    }

    this.data_ready = true
  }
}