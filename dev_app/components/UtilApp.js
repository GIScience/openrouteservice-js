import OrsUtil from '@/OrsUtil.js'

export default {
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      json_title: 'URL',
      url: '',
      data_ready: false
    }
  },
  methods: {},

  async mounted() {
    let orsUtil = new OrsUtil()
    this.url = orsUtil.prepareUrl({
      host: 'https://api.openrouteservice.org',
      service: '/elevation/line/'
    })

    this.data_ready = true
  }
}