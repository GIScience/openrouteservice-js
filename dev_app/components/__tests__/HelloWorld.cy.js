import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('mounts', () => {
    cy.mount(HelloWorld, { props: { msg: 'Hello' } })
  })

  it('renders properly', () => {
    cy.mount(HelloWorld, { props: { msg: 'Hello Cypress' } })
    cy.get('h1').should('contain', 'Hello Cypress')
    cy.get('h1').should('have.class','green')
    cy.get('.ors_call').should('contain.text', 'geocoding')
  })
})
