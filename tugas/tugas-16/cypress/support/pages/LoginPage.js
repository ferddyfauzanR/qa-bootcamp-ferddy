/**
 * Page Object Model - Login Page
 * OrangeHRM Demo Application
 */
class LoginPage {
  // ─── Selectors ───────────────────────────────────────────────
  get usernameInput()      { return cy.get('[name="username"]'); }
  get passwordInput()      { return cy.get('[name="password"]'); }
  get loginButton()        { return cy.get('[type="submit"]'); }
  get errorMessage()       { return cy.get('.oxd-alert-content-text'); }
  get usernameRequired()   { return cy.get('[name="username"]').closest('.oxd-input-group').find('.oxd-input-field-error-message'); }
  get passwordRequired()   { return cy.get('[name="password"]').closest('.oxd-input-group').find('.oxd-input-field-error-message'); }
  get forgotPasswordLink() { return cy.contains('Forgot your password?'); }
  get pageTitle()          { return cy.get('.orangehrm-login-title'); }

  // ─── Actions ─────────────────────────────────────────────────
  visit() {
    cy.visit('/web/index.php/auth/login');
  }

  fillUsername(username) {
    this.usernameInput.clear().type(username);
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
  }

  clickLogin() {
    this.loginButton.click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  clearAndSubmit() {
    this.usernameInput.clear();
    this.passwordInput.clear();
    this.clickLogin();
  }
}

export default new LoginPage();
