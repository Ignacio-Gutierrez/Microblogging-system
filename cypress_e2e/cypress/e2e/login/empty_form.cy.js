// cypress/e2e/login/empty_form.cy.js

describe('Login', () => {
  it('debería mostrar advertencia si se envía el formulario vacío', () => {
    cy.visit('http://localhost:8100/login');
    cy.get('[data-cy="login-submit-button"]').click();
    cy.get('[data-cy="login-error-banner"]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'completá todos los campos');
  });
});