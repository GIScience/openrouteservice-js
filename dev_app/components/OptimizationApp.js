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
    const orsOptimization = new Openrouteservice.Optimization({
      api_key: import.meta.env.VITE_ORS_API_KEY
    })

    let response = {}
    try {
      response = await orsOptimization.optimize({
        jobs: [
          {
            id: 1,
            service: 200,
            amount: [1],
            location: [1.98935, 47.701],
            skills: [1],
            time_windows: [[32400, 36000]]
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
            profile: 'cycling-regular',
            start: [2.35044, 47.71764],
            end: [2.35044, 47.71764],
            capacity: [4],
            skills: [1, 14],
            time_window: [28800, 43200]
          }
        ]
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