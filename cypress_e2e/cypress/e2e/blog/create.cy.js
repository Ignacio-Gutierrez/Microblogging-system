describe('Blog', () => {
  const uniqueId = Date.now();

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

    cy.get('[data-cy="blog-name-input"]').type(`Blog ${uniqueId}`);
    cy.get('[data-cy="blog-handle-input"]').type(`blog-${uniqueId}`);

    cy.get('[data-cy="blog-modal-submit-button"]').click();

    cy.get('[data-cy="blog-modal-submit-button"]', { timeout: 10000 }).should('not.exist');
    cy.contains(`Blog ${uniqueId}`).should('be.visible');
  });
});