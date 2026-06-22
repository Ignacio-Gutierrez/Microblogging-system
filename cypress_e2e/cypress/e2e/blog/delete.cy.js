// cypress/e2e/blog/delete.cy.js

describe('Blog', () => {
  const uniqueId = Date.now();

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/authenticate',
      body: { username: 'user', password: 'user' },
    }).then(resp => {
      const token = resp.body.id_token;
      cy.visit('http://localhost:8100/app/user/blogs');
      cy.window().its('localStorage').invoke('setItem', 'jhi-authenticationToken', token);
      cy.window().its('localStorage').invoke('setItem', 'jhi-username', 'user');
      cy.reload();
    });
  });

  it('debería eliminar un blog exitosamente', () => {
    // Primero crear un blog para tener algo que eliminar
    cy.get('[data-cy="create-blog-button"]').click();
    cy.get('[data-cy="blog-name-input"]').type(`Blog a borrar ${uniqueId}`);
    cy.get('[data-cy="blog-handle-input"]').type(`blog-a-borrar-${uniqueId}`);
    cy.get('[data-cy="blog-modal-submit-button"]').click();
    cy.get('[data-cy="blog-modal-submit-button"]', { timeout: 10000 }).should('not.exist');
    cy.contains(`Blog a borrar ${uniqueId}`).should('be.visible');

    // Click en el botón de acciones del blog (⋯)
    cy.contains(`Blog a borrar ${uniqueId}`)
      .parents('[data-cy="blog-card"]')
      .find('[data-cy="blog-actions-button"]')
      .click();

    // Click en "Eliminar blog" del popover
    cy.contains('button', 'Eliminar blog').click();

    // Confirmar en la alerta de Ionic
    cy.get('ion-alert').should('be.visible');
    cy.contains('button', 'Eliminar').click();

    // Verificar que el blog ya no esté en la lista
    cy.contains(`Blog a borrar ${uniqueId}`).should('not.exist');
  });
});