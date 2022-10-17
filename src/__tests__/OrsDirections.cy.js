import OrsDirections from '../OrsDirections'

const key = Cypress.env('api_key')

describe('Test Directions', () => {

  context('methods', () => {
    context('calculate', () => {
      it('fails without parameters', (done) => {
        const Directions = new OrsDirections({ 'api_key': key })
        Directions.calculate({}).catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('generates a simple route', (done) => {
        const Directions = new OrsDirections({ 'api_key': key })
        Directions.calculate({
          coordinates: [[8.690958, 49.404662], [8.687868, 49.390139]],
          profile: 'driving-car',
          format: 'json'
        }).then((json) => {
          expect(json["routes"].length).to.be.greaterThan(0)
          expect(json["routes"][0].summary.distance).to.be.greaterThan(2300)
          expect(json["routes"][0].summary.distance).to.be.lessThan(2500)
          done()
        })
      })
    })
  })
})
