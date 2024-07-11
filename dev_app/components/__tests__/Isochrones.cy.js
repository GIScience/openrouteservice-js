import Isochrones from '../IsochronesApp.vue'

describe('IsochronesApp component', () => {
  it('mounts', () => {
    cy.mount(Isochrones, { props: { msg: 'OrsIsochrones' } })
  })

  it('renders properly', () => {
    cy.mount(Isochrones, { props: { msg: 'OrsIsochrones' } })
    cy.get('h1').should('contain', 'OrsIsochrones')
    cy.get('h1').should('have.class', 'green')
    cy.get('.leaflet-container')
    cy.get('.leaflet-marker-icon').should('have.length', 3)
    cy.get('.ors_call').should('contain.text', 'service": "isochrones')
  })

  it('renders properly with single center', () => {
    cy.mount(Isochrones, {
      props: {
        points: [[8.681495, 49.41461]]
      }
    })
    cy.get('.leaflet-container')
    cy.get('.leaflet-marker-icon').should('have.length', 1)
    cy.get('.ors_call').should('contain.text', 'service": "isochrones')
  })
})
