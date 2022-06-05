describe('SignIn.cy.ts', () => {
  it('should redirect here if user is not authorized', () => {
    cy.visit('/');

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/sign-in');
    });
  });

  it('user should be able to sign in', () => {
    cy.visit('/sign-in');

    cy.get('input[name="username"]').type('letehaha');
    cy.get('input[type="password"]').type('password');

    cy.get('button[type="button"').click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/');
    });
  });

  it('user cannot sign in with invalid credentials', () => {
    cy.visit('/sign-in');

    cy.get('input[name="username"]').type('invalid');
    cy.get('input[type="password"]').type('invalid');

    cy.get('button[type="button"]').click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/sign-in');
    });
  });

  it('user should see error message with invalid credentials', () => {
    cy.visit('/sign-in');

    cy.get('input[name="username"]').type('invalid');
    cy.get('input[type="password"]').type('invalid');

    cy.get('button[type="button"]').click();

    cy.get('.form-wrapper__error').should('be.visible');
  });
});
