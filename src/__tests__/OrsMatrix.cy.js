/* eslint-disable no-undef */
import OrsMatrix from '../OrsMatrix.js'

const key = Cypress.env('api_key')
const orsMatrix = new OrsMatrix({ api_key: key })

describe('Matrix Test', function () {
  it('Get results', function (done) {
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
      .then(function (json) {
        expect(json.durations.length).to.equal(3)
        expect(json.destinations.length).to.equal(3)
        done()
      })
  })
})
