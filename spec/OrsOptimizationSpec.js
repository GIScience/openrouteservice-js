/* eslint-disable no-undef */
import OrsOptimization from '../src/OrsOptimization'
import Constants from '../src/constants'

describe('No api key Optimization Test', function() {
  it('Instantiate with no key results', function(done) {
    try {
      expect(function() {
        new OrsOptimization({})
      }).toThrow(new Error(Constants.missingAPIKeyMsg))
      done()
    } catch (error) {
      done.fail('No api key Optimization Test ' + error)
    }
  })
})

const orsOptimization = new OrsOptimization({ api_key: process.env.ORSKEY })

describe('Sample Route', function() {
  it('Get results', function(done) {
    orsOptimization
      .optimize({
        jobs: [
          {
            id: 1,
            service: 300,
            amount: [1],
            location: [1.98935, 48.701],
            skills: [1],
            time_windows: [[32400, 36000]]
          },
          {
            id: 2,
            service: 300,
            amount: [1],
            location: [2.03655, 48.61128],
            skills: [1]
          },
          {
            id: 3,
            service: 300,
            amount: [1],
            location: [2.39719, 49.07611],
            skills: [2]
          },
          {
            id: 4,
            service: 300,
            amount: [1],
            location: [2.41808, 49.22619],
            skills: [2]
          },
          {
            id: 5,
            service: 300,
            amount: [1],
            location: [2.28325, 48.5958],
            skills: [14]
          },
          {
            id: 6,
            service: 300,
            amount: [1],
            location: [2.89357, 48.90736],
            skills: [14]
          }
        ],
        vehicles: [
          {
            id: 1,
            profile: 'driving-car',
            start: [2.35044, 48.71764],
            end: [2.35044, 48.71764],
            capacity: [4],
            skills: [1, 14],
            time_window: [28800, 43200]
          },
          {
            id: 2,
            profile: 'driving-car',
            start: [2.35044, 48.71764],
            end: [2.35044, 48.71764],
            capacity: [4],
            skills: [2, 14],
            time_window: [28800, 43200]
          }
        ]
      })
      .then(function(json) {
        expect(json.summary.unassigned).toBe(0)
        expect(json.summary.delivery[0]).toBe(6)
        done()
      })
      .catch(function(err) {
        done.fail(err.message)
      })
  })

  it('Clear Optimization args', function(done) {
    orsOptimization.clear()
    try {
      expect(orsOptimization.args.jobs).toBeUndefined()
      expect(orsOptimization.args.vehicles).toBeUndefined()
      done()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(orsOptimization.args)
      done.fail(
        'Should not fail Clear Elevation args Test ' + orsOptimization.args
      )
    }
  })

  it('Get results with custom host and service', function(done) {
    let customHostAndServiceOptimization = new OrsOptimization({
      api_key: process.env.ORSKEY,
      host: Constants.defaultHost,
      service: 'optimization'
    })

    customHostAndServiceOptimization
      .optimize({
        jobs: [
          {
            id: 1,
            service: 300,
            amount: [1],
            location: [1.98935, 48.701],
            skills: [1],
            time_windows: [[32400, 36000]]
          },
          {
            id: 2,
            service: 300,
            amount: [1],
            location: [2.03655, 48.61128],
            skills: [2]
          },
          {
            id: 3,
            service: 300,
            amount: [1],
            location: [2.39719, 49.07611],
            skills: [3]
          }
        ],
        vehicles: [
          {
            id: 1,
            profile: 'driving-car',
            start: [2.35044, 48.71764],
            end: [2.35044, 48.71764],
            capacity: [2],
            skills: [1, 2],
            time_window: [28800, 43200]
          }
        ]
      })
      .then(function(json) {
        expect(json.summary.unassigned).toBe(1)
        expect(json.summary.delivery[0]).toBe(2)
        done()
      })
      .catch(function(err) {
        done.fail(err.message)
      })
  })
})
