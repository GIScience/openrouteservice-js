/* eslint-disable no-undef */
import OrsOptimization from '../OrsOptimization.js'

const key = Cypress.env('api_key')

const orsOptimization = new OrsOptimization({ 'api_key': key })

describe('Optimization Test', function() {

  it('generates routes', function(done) {
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
        expect(json['summary']['unassigned']).to.equal(0)
        expect(json['summary']['delivery'][0]).to.equal(6)
        expect(json['routes']['length']).to.equal(2)
        done()
      })
  })
})