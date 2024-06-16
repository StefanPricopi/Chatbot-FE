describe('Landing Page', () => {
  it('should disallow messages from unauthorized', () => {

    cy.intercept('POST', '/chat/newchat', {
      statusCode: 401,
      body: {
        message: 'Not authorized'
      }
    }).as('sendMsg')

    cy.visit('localhost:5173')
    cy.get("._inputField_13jmd_291")
    .type("Hello world")
    cy.contains('Send').click()

    cy.wait('@sendMsg')
    // Lets try and fix this so we can confirm it sends a message saying to log in first.
    //cy.get('_msg_bot_13jmd_249').should('contain', 'Please log in before using')

  })
})