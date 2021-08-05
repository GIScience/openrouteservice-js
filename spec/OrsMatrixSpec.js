/* eslint-disable no-undef */
import OrsMatrix from '../src/OrsMatrix'
import Constants from '../src/constants'

describe('No api key OrsMatrix Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsMatrix({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key OrsMatrix Test ' + error)
    }
  })
})

const orsMatrix = new OrsMatrix({ api_key: process.env.ORSKEY })

describe('Matrix Test', function() {
  it('Get results', function(done) {
    orsMatrix
      .calculate({
        locations: [
          [8.690958, 49.404662],
          [8.687868, 49.390139],
          [8.687868, 49.390133]
        ],
        profile: 'driving-car',
        sources: ['all'],
        destinations: ['all']
      })
      .then(function(json) {
        expect(json.durations.length).toEqual(3)
        expect(json.destinations.length).toEqual(3)
        done()
      })
      .catch(function(json) {
        done.fail('Should not fail' + json)
      })
  })
})
