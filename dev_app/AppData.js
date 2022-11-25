import Directions from './components/DirectionsApp.vue'
import Elevation from './components/ElevationApp.vue'
import Geocode from './components/GeocodeApp.vue'
import Isochrones from './components/IsochronesApp.vue'
import Matrix from './components/MatrixApp.vue'
import Optimization from './components/OptimizationApp.vue'
import Pois from './components/PoisApp.vue'

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
