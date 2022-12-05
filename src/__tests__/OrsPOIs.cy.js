import OrsPois from '../OrsPois.js'

const key = Cypress.env('api_key')
const orsPois = new OrsPois({ api_key: key })

describe('POI Test', function () {

  context('construction', () => {
    it('sets correct service', () => {
      expect(orsPois.defaultArgs.service).to.equal('pois')
    })
  })

  context('methods', () => {
    context('generatePayload', () => {
      it('writes args into payload, if not base URL constituents or API key or timeout', () => {
        let payload = orsPois
            .generatePayload({
              host: 'host',
              service: 'service',
              api_key: 'API key',
              timeout: 'timeout',
              notUrlConstituent: 'notUrlConstituent'
            })
        expect(payload).to.deep.equal({notUrlConstituent: 'notUrlConstituent'})
      })
    })

    context('pois', () => {
      it('fails without parameters', (done) => {
        orsPois.pois({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('gets results', (done) => {
        orsPois.pois({
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
      })
    })
  })

  context('unused functions', () => {
    it('clear() clears everything but API key', () => {
      orsPois.defaultArgs = {
        variable1: 'v1',
        api_key: 'API key'
      }
      orsPois.clear()
      expect(orsPois.defaultArgs).to.deep.equal({api_key: 'API key'})
    })
  })
})
