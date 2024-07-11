// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'OrsDirections')
    cy.get('.ors_call').should('contain.text', 'geocoding')
  })
})
