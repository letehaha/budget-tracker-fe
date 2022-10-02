/// <reference types="cypress" />

Cypress.Commands.add(
  'signInUser',
  ({ username, password }: { username: string; password: string }) => {
    cy.intercept(`${Cypress.env('baseApiUrl')}/**/auth/login*`).as('signIn');

    cy.visit('/sign-in');

    cy.get('input[name=username]').type(username);
    cy.get('input[type=password]').type(password);
    cy.get('button[type=submit]').click();

    cy.wait('@signIn');
  },
);

Cypress.Commands.add(
  'getNode',
  (dataCy, options) => cy.get(`[data-cy="${dataCy}"]`, options),
);

// Cypress.Commands.add('logout', () => {
//   cy.get('.account-dropdown__button').click();
//   cy.get('.account-dropdown__signout').contains('Log out').click();
// });
