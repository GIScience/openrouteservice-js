/* eslint-disable no-undef */
import OrsPois from '../OrsPois'

const key = Cypress.env('api_key')
const orsPois = new OrsPois({ api_key: key })

describe('POI Test', function () {
  it('Get results', function (done) {
    orsPois
      .pois({
        geometry: {
          bbox: [
            [8.8034, 53.0756],
            [8.7834, 53.0456]
          ],
          geojson: {
            type: 'Point',
            coordinates: [8.8034, 53.0756]
          },
          buffer: 250
        }
      })
      .then(function (response) {
        expect(response).to.be.instanceOf(Object)
        expect(response.features.length).to.be.greaterThan(2)
        expect(response.type).to.equal('FeatureCollection')
        expect(response.features[0].type).to.equal('Feature')
        expect(response.features[0].geometry.type).to.equal('Point')
        done()
      })
      .catch(function (json) {
        console.error('Should not fail' + json)
      })
  })
})
