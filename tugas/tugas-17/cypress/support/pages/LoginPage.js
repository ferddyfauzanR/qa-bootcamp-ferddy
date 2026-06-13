/**
 * ============================================================
 * PAGE OBJECT MODEL - Login Page
 * ============================================================
 * Aplikasi  : OrangeHRM Demo
 * URL       : https://opensource-demo.orangehrmlive.com
 * Dibuat    : Ferddy Fauzan Ramadhan
 * ============================================================
 */

class LoginPage {
  // ─── Selectors ────────────────────────────────────────────

  get usernameInput() {
    return cy.get('[name="username"]');
  }

  get passwordInput() {
    return cy.get('[name="password"]');
  }

  get loginButton() {
    return cy.get('[type="submit"]');
  }

  get errorMessage() {
    return cy.get('.oxd-alert-content-text');
  }

  get usernameRequiredMsg() {
    return cy
      .get('[name="username"]')
      .closest('.oxd-input-group')
      .find('.oxd-input-field-error-message');
  }

  get passwordRequiredMsg() {
    return cy
      .get('[name="password"]')
      .closest('.oxd-input-group')
      .find('.oxd-input-field-error-message');
  }

  get forgotPasswordLink() {
    return cy.contains('Forgot your password?');
  }

  get pageTitle() {
    return cy.get('.orangehrm-login-title');
  }

  get dashboardBreadcrumb() {
    return cy.get('.oxd-topbar-header-breadcrumb');
  }

  get userDropdown() {
    return cy.get('.oxd-userdropdown-tab');
  }

  // ─── Actions ──────────────────────────────────────────────

  /**
   * Navigasi ke halaman login
   */
  visit() {
    cy.visit('/web/index.php/auth/login');
  }

  /**
   * Isi field username
   * @param {string} username
   */
  fillUsername(username) {
    this.usernameInput.clear().type(username);
  }

  /**
   * Isi field password
   * @param {string} password
   */
  fillPassword(password) {
    this.passwordInput.clear().type(password);
  }

  /**
   * Klik tombol Login
   */
  clickLogin() {
    this.loginButton.click();
  }

  /**
   * Login lengkap: isi username, password, klik Login
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  /**
   * Submit form tanpa mengisi field apapun
   */
  submitEmpty() {
    this.usernameInput.clear();
    this.passwordInput.clear();
    this.clickLogin();
  }

  /**
   * Logout dari aplikasi
   */
  logout() {
    this.userDropdown.click();
    cy.contains('Logout').click();
    cy.url().should('include', '/auth/login');
  }
}

export default new LoginPage();
