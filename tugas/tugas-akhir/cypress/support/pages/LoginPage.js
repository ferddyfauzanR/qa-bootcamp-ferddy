class LoginPage {
  // ─── Selectors ───────────────────────────────────────────────
  get usernameInput() {
    return cy.get("input[name='username']");
  }

  get passwordInput() {
    return cy.get("input[name='password']");
  }

  get loginButton() {
    return cy.get("button[type='submit']");
  }

  get errorAlert() {
    return cy.get(".oxd-alert-content-text");
  }

  get requiredUsernameError() {
    return cy.get(".oxd-input-group").eq(0).find(".oxd-text--span");
  }

  get requiredPasswordError() {
    return cy.get(".oxd-input-group").eq(1).find(".oxd-text--span");
  }

  get forgotPasswordLink() {
    return cy.get(".orangehrm-login-forgot > p");
  }

  get dashboardHeader() {
    return cy.get(".oxd-topbar-header-title");
  }

  get userDropdown() {
    return cy.get(".oxd-userdropdown-tab");
  }

  get logoutMenu() {
    return cy.get(".oxd-userdropdown-link").contains("Logout");
  }

  get brandLogo() {
    return cy.get(".orangehrm-login-branding img");
  }

  get loginTitle() {
    return cy.get(".orangehrm-login-title");
  }

  // ─── Actions ─────────────────────────────────────────────────
  visit() {
    cy.visit("/web/index.php/auth/login");
  }

  typeUsername(username) {
    this.usernameInput.clear().type(username);
  }

  typePassword(password) {
    this.passwordInput.clear().type(password);
  }

  clickLoginButton() {
    this.loginButton.click();
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLoginButton();
  }

  clickForgotPassword() {
    this.forgotPasswordLink.click();
  }

  logout() {
    this.userDropdown.click();
    this.logoutMenu.click();
  }
}

export default new LoginPage();
