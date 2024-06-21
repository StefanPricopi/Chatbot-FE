describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:5173/home')


    // Checks whether we have been redirected to /login after having failed the authentication check.
    cy.url().should('include', '/login')

    cy.contains('Basworld Login')
  })
})