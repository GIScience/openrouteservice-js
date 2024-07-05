import OrsSnap from '../OrsSnap.js'

const key = Cypress.env('api_key')
const orsSnap = new OrsSnap({ 'api_key': key })

describe('Snap Test', () => {

    context('construction', () => {
        it('sets correct service and API version', () => {
            expect(orsSnap.defaultArgs.service).to.equal('snap')
            expect(orsSnap.defaultArgs.api_version).to.equal('v2')
        })
    })

    context('methods', () => {
        context('calculate', () => {
            it('fails without parameters', (done) => {
                orsSnap.calculate({})
                    .catch((err) => {
                        expect(err.status).to.equal(400)
                        expect(err.message).to.equal('Bad Request')
                        done()
                    })
            })

            it('generates a simple json snap', (done) => {
                orsSnap.calculate({
                    locations: [[8.681495,49.51461],[8.686507,49.41943]],
                    radius: 300,
                    profile: 'driving-car',
                    format: 'json'
                }).then((json) => {
                    expect(json['locations'].length).to.be.greaterThan(0)
                    expect(json['locations'][1].location).to.deep.equal([8.686507,49.41943])
                    expect(json['locations'][1].name).to.be.equal('Werderplatz')
                    expect(json['locations'][1].snapped_distance).exist
                    done()
                })
            })

            it('snapping point not found for first location', (done) => {
                orsSnap.calculate({
                    locations: [[0,0],[8.686507,49.41943]],
                    radius: 300,
                    profile: 'driving-car',
                    format: 'json'
                }).then((json) => {
                    expect(json['locations'][0]).to.be.null
                    expect(json['locations'][1]).to.exist
                    done()
                })
            })

            it('generates a simple geojson snap', (done) => {
                orsSnap.calculate({
                    locations: [[8.681495,49.51461],[8.686507,49.41943]],
                    radius: 300,
                    profile: 'driving-car',
                    format: 'geojson'
                }).then((json) => {
                    expect(json['features'].length).to.be.greaterThan(0)
                    expect(json['features'][0].properties.snapped_distance).exist
                    expect(json['features'][0].properties['source_id']).to.be.equal(0)
                    done()
                })
            })

            it('snapping point not found for first location in geojson', (done) => {
                orsSnap.calculate({
                    locations: [[0,0],[8.686507,49.41943]],
                    radius: 300,
                    profile: 'driving-car',
                    format: 'geojson'
                }).then((geojson) => {
                    expect(geojson['features'].length).to.be.equal(1)
                    expect(geojson['features'][0].properties['source_id']).to.be.equal(1)
                    done()
                })
            })

            it('sets customHeaders in request', () => {
                orsSnap.calculate({
                    locations: [[8.681495,49.51461],[8.686507,49.41943]],
                    radius: 300,
                    profile: 'driving-car',
                    format: 'json',
                    customHeaders: {'Accept': 'application/json'}
                })
                cy.intercept('GET', 'https://api.openrouteservice.org/snap', (req) => {
                    expect(req.headers).to.include({'Accept': 'application/json'})
                })
            })

        })
    })
})
