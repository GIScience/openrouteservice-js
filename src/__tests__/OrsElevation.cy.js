/* eslint-disable no-undef */
import OrsElevation from '../OrsElevation.js'

const key = Cypress.env('api_key')
const orsElevation = new OrsElevation({ 'api_key': key })

describe('Elevation Test', function () {
  it('Get Line elevation results', function (done) {
    orsElevation
      .lineElevation({
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
      }).catch(function (json) {
      throw('Should not fail' + json)
    })
  })

  it('Get Point elevation results', function (done) {
    new OrsElevation({ api_key: key})
      .pointElevation({
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
      .catch(function (json) {
        throw('Should not fail' + json.response)
      })
  })
})
