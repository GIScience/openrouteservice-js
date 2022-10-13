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
      response: {}
    }
  },
  methods: {},

  // `mounted` is a lifecycle hook
  mounted() {
    // `this` refers to the component instance.
    let geocode = new Openrouteservice.Geocode({ api_key: import.meta.env.VITE_ORS_API_KEY })
    console.log(geocode)
    // inside the promise we are in a different context when using 'this'
    // reassign the current context to be usable within
    let that = this
    geocode.geocode({
      text: "Heidelberg",
      boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
      boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
      boundary_country: ["DE"]
    })
      .then(function(json) {
        // data can be mutated as well
        that.response = JSON.stringify(json, null, "\t")
      })
      .catch(function(err) {
        that.response = JSON.stringify(err, null, "\t")
      });
  }
}
