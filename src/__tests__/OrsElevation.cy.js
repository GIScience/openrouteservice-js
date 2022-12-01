import OrsElevation from '../OrsElevation.js'

const key = Cypress.env('api_key')
const orsElevation = new OrsElevation({ 'api_key': key })

describe('Test Elevation', function () {

  context('methods', () => {
    context('generatePayload', () => {
      it('writes args into payload if not base URL constituents', () => {
        let payload = orsElevation
        .generatePayload({
          host: 'host',
          service: 'service',
          notUrlConstituent: 'notUrlConstituent'
        })
        expect(payload).to.deep.equal({notUrlConstituent: 'notUrlConstituent'})
      })
    })

    context('lineElevation', () => {
      it('sets correct service', () => {
        orsElevation.lineElevation({
          format_in: 'encodedpolyline',
          geometry: 'u`rgFswjpAKD'
        })
        expect(orsElevation.requestArgs.service).to.equal('elevation/line')
      })

      it('fails without parameters', (done) => {
        orsElevation.lineElevation({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('Get Line elevation results', (done) => {
        orsElevation.lineElevation({
            format_in: 'encodedpolyline',
            geometry: 'u`rgFswjpAKD'
          })
        .then(function (json) {
          expect(json.geometry.coordinates.length).to.equal(2)
          expect(json.geometry.type).to.equal('LineString')
          expect(json.geometry.coordinates[0][0]).to.equal(13.3313)
          expect(json.geometry.coordinates[0][1]).to.equal(38.10843)
          expect(json.geometry.coordinates[0][2]).to.equal(72)
          done()
        })
      })
    })

    context('pointElevation', () => {
      it('sets correct service', () => {
        orsElevation.pointElevation({
          format_in: 'point',
          geometry: [13.331273, 38.10849]
        })
        expect(orsElevation.requestArgs.service).to.equal('elevation/point')
      })

      it('fails without parameters', (done) => {
        orsElevation.pointElevation({})
        .catch((err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Bad Request')
          done()
        })
      })

      it('Get Point elevation results', (done) => {
        orsElevation.pointElevation({
          format_in: 'point',
          geometry: [13.331273, 38.10849]
        })
        .then(function (json) {
          expect(json.geometry.coordinates.length).to.equal(3)
          expect(json.geometry.type).to.equal('Point')
          expect(json.geometry.coordinates[0]).to.equal(13.331273)
          expect(json.geometry.coordinates[1]).to.equal(38.10849)
          expect(json.geometry.coordinates[2]).to.equal(72)
          done()
        })
      })
    })
  })

  context('unused functions', () => {
    it('clear() clears everything but API key', () => {
      orsElevation.defaultArgs = {
        variable1: 'v1',
        api_key: 'API key'
      }
      orsElevation.clear()
      expect(orsElevation.defaultArgs).to.deep.equal({api_key: 'API key'})
    })
  })
})
