/**
 * ============================================================
 * TEST AUTOMATION - MODUL LOGIN OrangeHRM (dengan cy.intercept)
 * ============================================================
 * Aplikasi  : OrangeHRM Demo
 * URL       : https://opensource-demo.orangehrmlive.com
 * Dibuat    : Ferddy Fauzan Ramadhan
 * Framework : Cypress
 * Quiz      : Quiz 4 — Login Intercept
 * ============================================================
 *
 * Setiap test case menggunakan cy.intercept() dengan
 * URL / validasi yang berbeda-beda sesuai ketentuan soal.
 * ============================================================
 */

import LoginPage from '../support/pages/LoginPage';

describe('Modul Login - OrangeHRM (Intercept)', () => {
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

    /**
     * TC-INT-01 | Login dengan kredensial valid
     * Intercept: POST /auth/validate → spy response status 200
     */
    it('[TC-INT-01] Login dengan kredensial valid — intercept POST /auth/validate', () => {
      cy.intercept('POST', '**/auth/validate').as('loginRequest');

      LoginPage.login(data.validUser.username, data.validUser.password);

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });

    /**
     * TC-INT-02 | Login lalu logout, lalu login kembali
     * Intercept: GET /dashboard/index (halaman dashboard dimuat setelah login)
     */
    it('[TC-INT-02] Login → Logout → Login kembali — intercept GET /dashboard/index', () => {
      cy.intercept('GET', '**/dashboard/index').as('dashboardPage');

      // Step 1: Login pertama
      LoginPage.login(data.validUser.username, data.validUser.password);
      cy.wait('@dashboardPage').its('response.statusCode').should('eq', 200);

      // Step 2: Logout
      cy.logout();

      // Step 3: Login kembali — re-register intercept
      cy.intercept('GET', '**/dashboard/index').as('dashboardPageSecond');
      LoginPage.login(data.validUser.username, data.validUser.password);

      cy.wait('@dashboardPageSecond').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });

  });

  // ============================================================
  // NEGATIVE CASE
  // ============================================================

  context('Negative Case', () => {

    /**
     * TC-INT-03 | Login dengan password salah
     * Intercept: POST /auth/validate → stub response 401 (simulasi server reject)
     */
    it('[TC-INT-03] Login dengan password salah — intercept + stub 401', () => {
      cy.intercept('POST', '**/auth/validate', {
        statusCode: 401,
        body: { error: 'Invalid credentials' },
      }).as('loginInvalid');

      LoginPage.login(data.validUser.username, data.invalidUser.password);

      cy.wait('@loginInvalid').its('response.statusCode').should('eq', 401);

      // Validasi UI: error message tampil
      LoginPage.errorMessage.should('be.visible').and('contain', 'Invalid credentials');
    });

    /**
     * TC-INT-04 | Login dengan username salah
     * Intercept: POST /auth/validate → validasi body request berisi username yang salah
     */
    it('[TC-INT-04] Login dengan username salah — intercept validasi request body', () => {
      cy.intercept('POST', '**/auth/validate').as('loginWrongUser');

      LoginPage.login(data.invalidUser.username, data.validUser.password);

      cy.wait('@loginWrongUser').then((interception) => {
        // Pastikan request body mengandung username yang salah
        expect(interception.request.body).to.include(data.invalidUser.username);
      });

      LoginPage.errorMessage.should('be.visible').and('contain', 'Invalid credentials');
    });

    /**
     * TC-INT-05 | Login dengan kedua field kosong
     * Intercept: POST /auth/validate → pastikan request TIDAK terpanggil (tombol submit harusnya dicegah validasi client)
     */
    it('[TC-INT-05] Login dengan kedua field kosong — intercept tidak dipanggil (client-side validation)', () => {
      let requestCalled = false;

      cy.intercept('POST', '**/auth/validate', (req) => {
        requestCalled = true;
        req.continue();
      }).as('loginEmpty');

      LoginPage.clearAndSubmit();

      // Validasi UI: required message tampil di kedua field
      LoginPage.usernameRequired.should('be.visible').and('contain', 'Required');
      LoginPage.passwordRequired.should('be.visible').and('contain', 'Required');

      // Konfirmasi: request ke server tidak terjadi
      cy.then(() => {
        expect(requestCalled).to.be.false;
      });
    });

    /**
     * TC-INT-06 | Login dengan username kosong
     * Intercept: GET /auth/login → pastikan user tetap di halaman login (tidak redirect)
     */
    it('[TC-INT-06] Login dengan username kosong — intercept GET /auth/login tidak redirect', () => {
      cy.intercept('GET', '**/auth/login').as('stayOnLogin');

      LoginPage.passwordInput.type(data.validUser.password);
      LoginPage.usernameInput.clear();
      LoginPage.clickLogin();

      // Validasi: required muncul di username field
      LoginPage.usernameRequired.should('be.visible').and('contain', 'Required');

      // URL tidak berubah dari login page
      cy.url().should('include', '/auth/login');
    });

    /**
     * TC-INT-07 | Login dengan password kosong
     * Intercept: POST /auth/validate → spy bahwa request body field password kosong / tidak terkirim
     */
    it('[TC-INT-07] Login dengan password kosong — intercept spy request tidak membawa password', () => {
      let requestFired = false;

      cy.intercept('POST', '**/auth/validate', (req) => {
        requestFired = true;
        req.continue();
      }).as('loginNoPass');

      LoginPage.usernameInput.type(data.validUser.username);
      LoginPage.passwordInput.clear();
      LoginPage.clickLogin();

      // Validasi UI: required tampil di field password
      LoginPage.passwordRequired.should('be.visible').and('contain', 'Required');

      // Validasi: client-side validation mencegah request ke server
      cy.then(() => {
        expect(requestFired).to.be.false;
      });
    });

    /**
     * TC-INT-08 | Login dengan spasi di username
     * Intercept: POST /auth/validate → validasi request body mengandung spasi
     */
    it('[TC-INT-08] Login dengan spasi di username — intercept validasi request body mengandung spasi', () => {
      cy.intercept('POST', '**/auth/validate').as('loginWithSpace');

      LoginPage.login(` ${data.validUser.username} `, data.validUser.password);

      cy.wait('@loginWithSpace').then((interception) => {
        // Pastikan request body mengandung spasi (tidak di-trim oleh browser/app)
        expect(interception.request.body).to.include(' Admin ');
      });

      LoginPage.errorMessage.should('be.visible').and('contain', 'Invalid credentials');
    });

  });

  // ============================================================
  // UI & FITUR PENDUKUNG
  // ============================================================

  context('UI & Fitur Pendukung', () => {

    /**
     * TC-INT-09 | Verifikasi field password ter-mask
     * Intercept: GET static asset CSS OrangeHRM (verifikasi halaman login dimuat sempurna)
     */
    it('[TC-INT-09] Field password ter-mask — intercept GET static CSS halaman login', () => {
      cy.intercept('GET', '**/*.css').as('cssLoaded');

      LoginPage.visit();

      cy.wait('@cssLoaded').its('response.statusCode').should('be.oneOf', [200, 304]);

      LoginPage.passwordInput.type(data.validUser.password);
      LoginPage.passwordInput.should('have.attr', 'type', 'password');
    });

    /**
     * TC-INT-10 | Klik "Forgot your password?" diarahkan ke halaman reset
     * Intercept: GET /auth/requestPasswordResetCode → verifikasi status 200
     */
    it('[TC-INT-10] Klik "Forgot your password?" — intercept GET /requestPasswordResetCode', () => {
      cy.intercept('GET', '**/auth/requestPasswordResetCode').as('forgotPasswordPage');

      LoginPage.forgotPasswordLink.click();

      cy.wait('@forgotPasswordPage').its('response.statusCode').should('eq', 200);

      cy.url().should('include', '/auth/requestPasswordResetCode');
      cy.contains('Reset Password').should('be.visible');
    });

  });

});
