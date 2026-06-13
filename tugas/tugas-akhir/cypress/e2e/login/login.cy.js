/**
 * ============================================================
 *  TUGAS AKHIR - OrangeHRM Automation
 *  Feature  : Login
 *  Format   : Page Object Model (POM) + Intercept
 *  Author   : Ferddy Fauzan
 *  TC Count : 8 Test Cases
 * ============================================================
 */

import LoginPage from "../../support/pages/LoginPage";

describe("Login Feature - OrangeHRM", () => {
  beforeEach(() => {
    cy.fixture("users").as("users");
    LoginPage.visit();
  });

  // ─── TC-L01 ─────────────────────────────────────────────────
  it("TC-L01 | Login berhasil dengan kredensial yang valid", function () {
    // FIX: Login OrangeHRM pakai form redirect (bukan XHR POST).
    // Intercept page load ke dashboard setelah login berhasil.
    cy.intercept("GET", "**/dashboard/index").as("loginSuccess");

    LoginPage.login(this.users.validUser.username, this.users.validUser.password);

    cy.wait("@loginSuccess").then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
    });

    cy.url().should("include", "/dashboard");
    LoginPage.dashboardHeader.should("be.visible");
  });

  // ─── TC-L02 ─────────────────────────────────────────────────
  it("TC-L02 | Login gagal dengan username salah", function () {
    // FIX: Login gagal → halaman tetap di /auth/login (tidak redirect).
    // Intercept GET ke halaman login itu sendiri (re-render setelah error).
    cy.intercept("GET", "**/core/i18n/messages**").as("pageReload");

    LoginPage.login(
      this.users.wrongUsernameValidPassword.username,
      this.users.wrongUsernameValidPassword.password
    );

    cy.wait("@pageReload");

    LoginPage.errorAlert
      .should("be.visible")
      .and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  // ─── TC-L03 ─────────────────────────────────────────────────
  it("TC-L03 | Login gagal dengan password salah", function () {
    cy.intercept("GET", "**/core/i18n/messages**").as("pageReload");

    LoginPage.login(
      this.users.validUsernameWrongPassword.username,
      this.users.validUsernameWrongPassword.password
    );

    cy.wait("@pageReload");

    LoginPage.errorAlert
      .should("be.visible")
      .and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  // ─── TC-L04 ─────────────────────────────────────────────────
  it("TC-L04 | Validasi field username dan password tidak boleh kosong", function () {
    LoginPage.clickLoginButton();

    LoginPage.requiredUsernameError.should("be.visible").and("contain.text", "Required");
    LoginPage.requiredPasswordError.should("be.visible").and("contain.text", "Required");
  });

  // ─── TC-L05 ─────────────────────────────────────────────────
  it("TC-L05 | Login gagal dengan username kosong dan password terisi", function () {
    LoginPage.typePassword(this.users.validUser.password);
    LoginPage.clickLoginButton();

    LoginPage.requiredUsernameError.should("be.visible").and("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

  // ─── TC-L06 ─────────────────────────────────────────────────
  it("TC-L06 | Login gagal dengan username terisi dan password kosong", function () {
    LoginPage.typeUsername(this.users.validUser.username);
    LoginPage.clickLoginButton();

    LoginPage.requiredPasswordError.should("be.visible").and("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

  // ─── TC-L07 ─────────────────────────────────────────────────
  it("TC-L07 | Halaman login menampilkan elemen UI yang benar", function () {
    LoginPage.brandLogo.should("be.visible");
    LoginPage.loginTitle.should("be.visible").and("contain.text", "Login");
    LoginPage.usernameInput.should("be.visible");
    LoginPage.passwordInput.should("be.visible");
    LoginPage.loginButton.should("be.visible").and("contain.text", "Login");
    LoginPage.forgotPasswordLink.should("be.visible");
  });

  // ─── TC-L08 ─────────────────────────────────────────────────
  it("TC-L08 | Klik Forgot Password mengarahkan ke halaman reset password", function () {
    LoginPage.clickForgotPassword();

    cy.url().should("include", "/requestPasswordResetCode");
    cy.get("h6").should("contain.text", "Reset Password");
  });
});
