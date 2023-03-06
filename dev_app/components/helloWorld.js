import Openrouteservice from '@/index.js'

export default {
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      api_key: import.meta.env.VITE_ORS_API_KEY,
      json_data: {},
      data_ready: false
    }
  },
  methods: {},

  // `mounted` is a lifecycle hook
  async mounted() {
    // `this` refers to the component instance.
    let geocode = new Openrouteservice.Geocode({api_key: this.api_key})

    try {
      const response = await geocode.geocode({
        text: "Heidelberg",
        boundary_circle: {lat_lng: [49.412388, 8.681247], radius: 50},
        boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
        boundary_country: ["DE"]
      })
      this.json_data = JSON.stringify(response, null, "\t")
    } catch (e) {
      this.json_data = JSON.stringify(e, null, "\t")
    }
    // if we don't wait for the response it won't be available at the time it is tested
    // see: https://stackoverflow.com/questions/53513538/is-async-await-available-in-vue-js-mounted
    this.data_ready = true

  }
}
