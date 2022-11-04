import OrsDirections from '../OrsDirections.js'

const key = Cypress.env('api_key')

const orsDirections = new OrsDirections({ 'api_key': key })

describe('Test Directions', () => {

  context('methods', () => {
    context('calculate', () => {
      it('fails without parameters', (done) => {
        orsDirections.calculate({}).catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('generates a simple route', (done) => {
        orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'driving-car',
          format: 'json'
        }).then((json) => {
          expect(json['routes'].length).to.be.greaterThan(0)
          expect(json['routes'][0].summary.distance).to.be.greaterThan(2300)
          expect(json['routes'][0].summary.distance).to.be.lessThan(2500)
          done()
        })
      })

      it('adjusts reqArgs for multiple requests', async () => {
        let json1 = await orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'cycling-regular'
        })
        expect(orsDirections.argsCache.profile).to.equal('cycling-regular')
        let json2 = await orsDirections.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'foot-walking'
        })
        expect(orsDirections.argsCache.profile).to.equal('foot-walking')

        expect(json1).to.haveOwnProperty('metadata')
        expect(json2).to.haveOwnProperty('metadata')
        expect(json1['metadata']).to.not.equal(json2['metadata'])
        expect(json1['metadata']['query']['profile']).to.equal('cycling-regular')
        expect(json2['metadata']['query']['profile']).to.equal('foot-walking')
      })
    })
  })
})
