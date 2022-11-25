import Geocode from '../GeocodeApp.vue'

describe('GeocodeApp component', () => {
  it('mounts', () => {
    cy.mount(Geocode, { props: { msg: 'OrsGeocode' } })
  })

  it('renders properly', () => {
    cy.mount(Geocode, { props: { msg: 'OrsGeocode' } })
    cy.get('h1').should('contain', 'OrsGeocode')
    cy.get('h1').should('have.class','green')
    cy.get('.ors_call').should('contain.text', 'geocoding')
  })
})
