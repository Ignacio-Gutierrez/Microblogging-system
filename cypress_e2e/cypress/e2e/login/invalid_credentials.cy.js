describe('Login', () => {
  it('debería mostrar error con credenciales inválidas', () => {
    cy.visit('http://localhost:8100/login');
    cy.get('[data-cy="login-username-input"]').type('usuario_incorrecto');
    cy.get('[data-cy="login-password-input"]').type('clave_incorrecta');
    cy.get('[data-cy="login-submit-button"]').click();
    cy.get('[data-cy="login-error-banner"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Usuario o contraseña incorrectos');
  });
});