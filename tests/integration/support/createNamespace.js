Cypress.Commands.add('createNamespace', namespaceName => {
  cy.log('Create a Namespace');

  cy.getLeftNav()
    .contains('Namespaces')
    .click();

  cy.openCreate();

  cy.get('.create-form')
    .find('[accessible-name="Namespace name"]:visible')
    .find('input')
    .type(namespaceName, { force: true })
    .click();

  cy.saveChanges('Create');
});
