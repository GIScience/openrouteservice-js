/* eslint-disable no-undef */
import OrsElevation from '../src/OrsElevation'
import Constants from '../src/constants'

describe('No api key Elevation Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsElevation({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key Elevation Test ' + error)
    }
  })
})

const orsElevation = new OrsElevation({ api_key: process.env.ORSKEY })

describe('Elevation Test', function() {
  it('Get Line elevation results', function(done) {
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

  it('Clear Elevation args', function(done) {
    orsElevation.clear()
    try {
      expect(orsElevation.args.service).toBeUndefined()
      done()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(orsDirections.args)
      done.fail(
        'Should not fail Clear Elevation args Test ' + orsDirections.args
      )
    }
  })

  it('Get Point elevation results', function(done) {
    new OrsElevation({ api_key: process.env.ORSKEY })
      .pointElevation({
        format_in: 'point',
        geometry: [13.331273, 38.10849]
      })
      .then(function(json) {
        expect(json.geometry.coordinates.length).toEqual(3)
        expect(json.geometry.type).toEqual('Point')
        expect(json.geometry.coordinates[0]).toEqual(13.331273)
        expect(json.geometry.coordinates[1]).toEqual(38.10849)
        expect(json.geometry.coordinates[2]).toEqual(72)
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json.response)
      })
  })
})
