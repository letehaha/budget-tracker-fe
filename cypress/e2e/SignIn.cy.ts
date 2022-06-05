describe('SignIn.cy.ts', () => {
  it('should redirect here if user is not authorized', () => {
    cy.visit('/');

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/sign-in');
    });
  });
});
