import Directions from './components/Directions.vue'
import Elevation from './components/Elevation.vue'
import Geocode from './components/Geocode.vue'
import Isochrones from './components/Isochrones.vue'
import Matrix from './components/Matrix.vue'
import Optimization from './components/Optimization.vue'
import Pois from './components/Pois.vue'

export default {
  components: {
    Directions,
    Elevation,
    Geocode,
    Isochrones,
    Matrix,
    Optimization,
    Pois
  },
  data() {
    return {
      renderedData: 'Directions',
      servicesData: [
        'Directions',
        'Elevation',
        'Geocode',
        'Isochrones',
        'Matrix',
        'Optimization',
        'Pois'
      ]
    }
  },
  methods: {}
}