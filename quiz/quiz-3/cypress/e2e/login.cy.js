/**
 * ============================================================
 * TEST AUTOMATION - MODUL LOGIN OrangeHRM
 * ============================================================
 * Aplikasi  : OrangeHRM Demo
 * URL       : https://opensource-demo.orangehrmlive.com
 * Dibuat    : Ferddy Fauzan Ramadhan
 * Framework : Cypress
 * ============================================================
 */

import LoginPage from '../support/pages/LoginPage';

describe('Modul Login - OrangeHRM', () => {
  // ─── Load fixture data ──────────────────────────────────────
  let data;

  before(() => {
    cy.fixture('loginData').then((fixture) => {
      data = fixture;
    });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  // ============================================================
  // POSITIVE CASE
  // ============================================================

  context('Positive Case', () => {
    it('[TC-LOG-01] Login dengan kredensial valid', () => {
      // Steps
      LoginPage.login(data.validUser.username, data.validUser.password);

      // Expected Result: diarahkan ke halaman Dashboard
      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });

    it('[TC-LOG-02] Login lalu logout, lalu login kembali', () => {
      // Step 1: Login
      LoginPage.login(data.validUser.username, data.validUser.password);
      cy.url().should('include', '/dashboard/index');

      // Step 2: Logout
      cy.logout();

      // Step 3: Login kembali
      LoginPage.login(data.validUser.username, data.validUser.password);

      // Expected Result: kembali masuk ke Dashboard
      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });
  });

  // ============================================================
  // NEGATIVE CASE
  // ============================================================

  context('Negative Case', () => {
    it('[TC-LOG-03] Login dengan password salah', () => {
      // Steps
      LoginPage.login(data.validUser.username, data.invalidUser.password);

      // Expected Result: muncul pesan error "Invalid credentials"
      LoginPage.errorMessage.should('be.visible');
      LoginPage.errorMessage.should('contain', 'Invalid credentials');
    });

    it('[TC-LOG-04] Login dengan username salah', () => {
      // Steps
      LoginPage.login(data.invalidUser.username, data.validUser.password);

      // Expected Result: muncul pesan error "Invalid credentials"
      LoginPage.errorMessage.should('be.visible');
      LoginPage.errorMessage.should('contain', 'Invalid credentials');
    });

    it('[TC-LOG-05] Login dengan kedua field kosong', () => {
      // Steps: langsung klik Login tanpa isi apapun
      LoginPage.clearAndSubmit();

      // Expected Result: muncul validasi "Required" pada kedua field
      LoginPage.usernameRequired.should('be.visible').and('contain', 'Required');
      LoginPage.passwordRequired.should('be.visible').and('contain', 'Required');
    });

    it('[TC-LOG-06] Login dengan username kosong', () => {
      // Steps: hanya isi password
      LoginPage.passwordInput.type(data.validUser.password);
      LoginPage.usernameInput.clear();
      LoginPage.clickLogin();

      // Expected Result: muncul validasi "Required" pada field username
      LoginPage.usernameRequired.should('be.visible').and('contain', 'Required');
    });

    it('[TC-LOG-07] Login dengan password kosong', () => {
      // Steps: hanya isi username
      LoginPage.usernameInput.type(data.validUser.username);
      LoginPage.passwordInput.clear();
      LoginPage.clickLogin();

      // Expected Result: muncul validasi "Required" pada field password
      LoginPage.passwordRequired.should('be.visible').and('contain', 'Required');
    });

    it('[TC-LOG-08] Login dengan spasi di username (leading & trailing)', () => {
      // Steps: username diawali dan diakhiri spasi
      LoginPage.login(` ${data.validUser.username} `, data.validUser.password);

      // Expected Result: error "Invalid credentials"
      LoginPage.errorMessage.should('be.visible');
      LoginPage.errorMessage.should('contain', 'Invalid credentials');
    });

    it('[TC-LOG-09] Login dengan username huruf kecil semua (case-insensitive check)', () => {
      // Steps: username "admin" semua huruf kecil
      LoginPage.login('admin', data.validUser.password);

      // Expected Result: user berhasil login dan masuk ke Dashboard
      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });
  });

  // ============================================================
  // UI & FITUR PENDUKUNG
  // ============================================================

  context('UI & Fitur Pendukung', () => {
    it('[TC-LOG-10] Verifikasi field password ter-mask (type="password")', () => {
      // Steps: ketik password lalu cek apakah ter-mask
      LoginPage.passwordInput.type(data.validUser.password);

      // Expected Result: karakter password tidak terlihat (type="password")
      LoginPage.passwordInput.should('have.attr', 'type', 'password');
    });

    it('[TC-LOG-11] Klik link "Forgot your password?" diarahkan ke halaman reset', () => {
      // Steps: klik link forgot password
      LoginPage.forgotPasswordLink.click();

      // Expected Result: halaman reset password tampil
      cy.url().should('include', '/auth/requestPasswordResetCode');
      cy.contains('Reset Password').should('be.visible');
    });
  });
});
