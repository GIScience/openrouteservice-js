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
      api_key: import.meta.env.VITE_ORS_API_KEY,
      json_title: '',
      json_data: {},
      json_data_reverse: {},
      data_ready: false
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
    this.json_data = JSON.stringify(response, null, "\t")
    this.json_data_reverse = JSON.stringify(reverseResponse, null, "\t")

    // if we don't wait for the response it won't be available at the time it is tested
    // see: https://stackoverflow.com/questions/53513538/is-async-await-available-in-vue-js-mounted
    this.data_ready = true

  }
}
