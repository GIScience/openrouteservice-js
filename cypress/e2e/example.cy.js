// https://docs.cypress.io/api/introduction/api.html

describe('Test open route services endpoint components', () => {
  it('visits the app root url & click buttons', () => {
    cy.viewport(1800,1000)
    //test directions
    cy.visit('/')
    cy.contains('h3', 'You’ve successfully created a project with')
    cy.get('.leaflet-marker-icon').should('have.length', 4)
    cy.get('.ors_call').should('contain.text', 'routing')
    //test elevation
    cy.contains('button','Elevation').click()
    cy.get('.leaflet-marker-icon').should('have.length', 2)
    cy.get('.ors_call').should('contain.text', 'geometry')

    //test geocode
    cy.contains('button','Geocode').click()
    cy.get('.leaflet-marker-icon').should('have.length', 10)
    cy.get('.ors_call').should('contain.text', 'geocoding')

    //test Isochrones
    cy.contains('button','Isochrones').click()
    cy.get('.leaflet-marker-icon').should('have.length', 3)
    cy.get('.ors_call').should('contain.text', 'isochrones')

    //test Matrix
    cy.contains('button','Matrix').click()
    cy.get('.leaflet-marker-icon').should('have.length', 3)
    cy.get('.ors_call').should('contain.text', 'matrix')

    //test Optimization
    cy.contains('button','Optimization').click()
    cy.get('.leaflet-marker-icon').should('have.length', 5)
    cy.get('.ors_call').should('contain.text', 'job')
    cy.get('.ors_call').should('contain.text', 'vehicle')

    //test Pois
    cy.contains('button','Pois').click()
    cy.get('.leaflet-marker-icon').should('have.length', 33)
    cy.get('.ors_call').should('contain.text', 'pois')
  })
})
