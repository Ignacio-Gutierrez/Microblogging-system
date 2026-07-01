describe('Login', () => {
  it('debería iniciar sesión correctamente y redirigir al feed', () => {
    cy.visit('http://localhost:8100/login');
    cy.get('[data-cy="login-username-input"]').type('user');
    cy.get('[data-cy="login-password-input"]').type('user');
    cy.get('[data-cy="login-submit-button"]').click();
    cy.location('pathname', { timeout: 10000 }).should('eq', '/app/feed');
  });
});