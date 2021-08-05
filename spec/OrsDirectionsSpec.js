/* eslint-disable no-undef */
import OrsDirections from '../src/OrsDirections'
import OrsInput from '../src/OrsInput'
import Constants from '../src/constants'

describe('No api key Directions Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsDirections({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key Directions Test ' + error)
    }
  })
})

const orsDirections = new OrsDirections({ api_key: process.env.ORSKEY })

describe('Simple Route', function() {
  it('Get results', function(done) {
    orsDirections.clearPoints()
    orsDirections.addWaypoint(new OrsInput('8.690958', '49.404663').coord)
    orsDirections.addWaypoint(new OrsInput('8.687868', '49.390139').coord)

    orsDirections
      .calculate({
        profile: 'driving-car',
        format: 'json'
      })
      .then(function(json) {
        expect(json.routes.length).toBeGreaterThan(0)
        expect(json.routes[0].summary.distance).toBeGreaterThan(2300)
        expect(json.routes[0].summary.distance).toBeLessThan(2800)
        done()
      })
      .catch(function(err) {
        done.fail(err.message)
      })
  })

  it('Get results with custom host and service', function(done) {
    let customHostAndServiceDirections = new OrsDirections({
      api_key: process.env.ORSKEY,
      host: Constants.defaultHost,
      service: 'directions'
    })
    customHostAndServiceDirections.addWaypoint(
      new OrsInput('8.690958', '49.404663').coord
    )
    customHostAndServiceDirections.addWaypoint(
      new OrsInput('8.687868', '49.390139').coord
    )

    customHostAndServiceDirections
      .calculate({
        profile: 'driving-car',
        format: 'json'
      })
      .then(function(json) {
        expect(json.routes.length).toBeGreaterThan(0)
        expect(json.routes[0].summary.distance).toBeGreaterThan(2300)
        expect(json.routes[0].summary.distance).toBeLessThan(2800)
        done()
      })
      .catch(function(err) {
        done.fail(err.message)
      })
  })

  it('Clear directions args', function(done) {
    orsDirections.clear()
    try {
      expect(orsDirections.args.coordinates).toBeUndefined()
      done()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(orsDirections.args)
      done.fail(
        'Should not fail Clear directions args Test ' + orsDirections.args
      )
    }
  })

  it('Compare Fastest vs. Shortest', function(done) {
    orsDirections.clearPoints()
    orsDirections.addWaypoint(new OrsInput('8.690958', '49.404662').coord)
    orsDirections.addWaypoint(new OrsInput('8.687868', '49.390139').coord)

    orsDirections
      .calculate({
        profile: 'driving-car',
        preference: 'fastest',
        format: 'json'
      })
      .then(function(json) {
        var fastestTime = json.routes[0].summary.duration
        var fastestDistance = json.routes[0].summary.distance
        // Shortest is not prepared with CH
        orsDirections
          .calculate({
            profile: 'driving-car',
            preference: 'shortest',
            avoidables: ['tollways', 'ferries', 'fords'],
            format: 'json'
          })
          .then(function(json2) {
            expect(json2.routes[0].summary.duration).toBeGreaterThan(
              fastestTime
            )
            expect(json2.routes[0].summary.distance).toBeLessThan(
              fastestDistance
            )
            done()
          })
          .catch(function(err) {
            done.fail(err.message)
          })
      })
      .catch(function(err) {
        done.fail(err.message)
      })
  })
})
