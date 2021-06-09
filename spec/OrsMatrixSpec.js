import OrsMatrix from '../src/OrsMatrix'
const orsMatrix = new OrsMatrix({ api_key: '5b3ce3597851110001cf62484c2b303725d843b5b765b5e83e8e3c30'})

describe('Matrix Test', function() {
  it('Get results', function(done) {
    orsMatrix
      .calculate({
        locations: [[8.690958, 49.404662], [8.687868, 49.390139], [8.687868, 49.390133]],
        profile: "driving-car",
        sources: ['all'],
        destinations: ['all']
      })
      .then(function(json) {
        expect(json.durations.length).toEqual(3)
        expect(json.destinations.length).toEqual(3)
        done()
      })
      .catch(function(json) {
        done.fail("Shouldn't fail" + json)
      })
  })
})
