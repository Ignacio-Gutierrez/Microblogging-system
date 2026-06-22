describe('Blog', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.get('[data-cy="login-username-input"]').type('user');
    cy.get('[data-cy="login-password-input"]').type('user');
    cy.get('[data-cy="login-submit-button"]').click();
    cy.location('pathname', { timeout: 10000 }).should('eq', '/app/feed');
  });

  it('debería crear un blog exitosamente', () => {
    cy.visit('http://localhost:8100/app/user/blogs');

    cy.get('[data-cy="create-blog-button"]').click();

    cy.get('[data-cy="blog-name-input"]').type('Mi Blog de Prueba');
    cy.get('[data-cy="blog-handle-input"]').type('mi-blog-prueba');

    cy.get('[data-cy="blog-modal-submit-button"]').click();

    cy.get('[data-cy="blog-modal-submit-button"]', { timeout: 10000 }).should('not.exist');
    cy.contains('Mi Blog de Prueba').should('be.visible');
  });
});