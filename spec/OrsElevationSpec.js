/* eslint-disable no-undef */
import OrsElevation from '../src/OrsElevation'

const orsElevation = new OrsElevation({ api_key: process.env.ORSKEY })

describe('Elevation Test', function() {
  it('Get results', function(done) {
    orsElevation
      .lineElevation({
        format_in: 'encodedpolyline',
        geometry: 'u`rgFswjpAKD'
      })
      .then(function(json) {
        expect(json.geometry.coordinates.length).toEqual(2)
        expect(json.geometry.type).toEqual('LineString')
        expect(json.geometry.coordinates[0][0]).toEqual(13.3313)
        expect(json.geometry.coordinates[0][1]).toEqual(38.10843)
        expect(json.geometry.coordinates[0][2]).toEqual(72)
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json)
      })
  })
})
