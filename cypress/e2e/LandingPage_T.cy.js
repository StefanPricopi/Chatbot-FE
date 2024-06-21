describe('template spec', () => {
  it('Checks whether the landing page succesfully loads', () => {
    cy.visit('localhost:5173')

    cy.contains('BUY VEHICLES AND MACHINERY WORLDWIDE')
  })
})