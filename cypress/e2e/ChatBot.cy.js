describe('template spec', () => {
  it('passes', () => {
    
    cy.intercept('POST', '/chat/newchat', {
      statusCode: 201,
      body: {
        "chat_id":10104
      }
    }).as('sendMsg');

    cy.intercept('POST', '/faqs/getChatbotResponse', {
      statusCode: 201,
      body: "You can reset your password by visiting our website and following the 'forgot password' link on the login page"
    }).as('chatBotResponse');

    cy.intercept('POST', '/chat/logMsg', {
      statusCode: 201
    }).as('chatlogging');

    cy.visit('http://localhost:5173/')
    cy.get("._inputField_13jmd_291")
    .type("Where can I reset my password ?");
    cy.contains("Send").click();

    cy.wait('@sendMsg')
    cy.wait('@chatBotResponse')

    cy.contains("You can reset your password by visiting our website and following the 'forgot password' link on the login page")
  })

  it('fails because not authenticated', () => {
    
    cy.intercept('POST', '/chat/newchat', {
      statusCode: 401,
      body: {
        //"chat_id":10104
      }
    }).as('sendMsg');

    cy.intercept('POST', '/faqs/getChatbotResponse', {
      statusCode: 401,
      //body: "You can reset your password by visiting our website and following the 'forgot password' link on the login page"
    }).as('chatBotResponse');

    cy.intercept('POST', '/chat/logMsg', {
      statusCode: 201
    }).as('chatlogging');

    cy.visit('http://localhost:5173/')
    cy.get("._inputField_13jmd_291")
    .type("Where can I reset my password ?");
    cy.contains("Send").click();

    cy.wait('@sendMsg')
    //cy.wait('@chatBotResponse')

    cy.contains("Please log in before using !")
  });

  it('fails because cannot find answer', () => {
    cy.intercept('POST', '/chat/newchat', {
      statusCode: 201,
      body: {
        "chat_id":10104
      }
    }).as('sendMsg');

    cy.intercept('POST', '/chat/logMsg', {
      statusCode: 201
    }).as('chatlogging');

    cy.visit('http://localhost:5173/')
    cy.get("._inputField_13jmd_291")
    .type("Hello world, where do unicorns come from?");
    cy.contains("Send").click();

    cy.wait('@sendMsg')
    //cy.wait('@chatBotResponse')

    cy.contains("I'm sorry, I don't understand your question.")
  });

  it('fails and counts amounts', () => {
    cy.intercept('POST', '/chat/newchat', {
      statusCode: 201,
      body: {
        "chat_id":10104
      }
    }).as('sendMsg');

    cy.intercept('POST', '/chat/logMsg', {
      statusCode: 201
    }).as('chatlogging');

    cy.visit('http://localhost:5173/')
    cy.get("._inputField_13jmd_291")
    .type("Hello world, where do unicorns come from?");
    cy.contains("Send").click();

    cy.wait('@sendMsg')

    cy.get("._inputField_13jmd_291")
    .type("Oh you do not know either awh thats to bad !");
    cy.contains("Send").click();

    //cy.contains("I'm sorry, I don't understand your question.")
  });
})