import OrsDirections from '../src/OrsDirections'
import OrsInput from '../src/OrsInput'
const orsDirections = new OrsDirections({ api_key: '5b3ce3597851110001cf62484c2b303725d843b5b765b5e83e8e3c30'})

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
