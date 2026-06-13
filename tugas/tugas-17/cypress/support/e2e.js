// cypress/support/e2e.js
// Global configurations and custom commands

// ─── Custom Commands ──────────────────────────────────────────

/**
 * Custom command: login via UI
 * @param {string} username
 * @param {string} password
 */
Cypress.Commands.add('loginViaUI', (username, password) => {
  cy.visit('/web/index.php/auth/login');
  cy.get('[name="username"]').clear().type(username);
  cy.get('[name="password"]').clear().type(password);
  cy.get('[type="submit"]').click();
});

/**
 * Custom command: logout dari OrangeHRM
 */
Cypress.Commands.add('logout', () => {
  cy.get('.oxd-userdropdown-tab').click();
  cy.contains('Logout').click();
  cy.url().should('include', '/auth/login');
});
