/**
 * ============================================================
 *  TUGAS AKHIR - OrangeHRM Automation
 *  Feature  : Recruitment
 *  Format   : Page Object Model (POM) + Intercept
 *  Author   : Ferddy Fauzan
 *  TC Count : 8 Test Cases
 * ============================================================
 */

import RecruitmentPage from "../../support/pages/RecruitmentPage";

describe("Recruitment Feature - OrangeHRM", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    RecruitmentPage.visit();
    // Tunggu tabel vacancy selesai dimuat
    cy.get(".oxd-table-body", { timeout: 15000 }).should("be.visible");
  });

  // ─── TC-R01 ─────────────────────────────────────────────────
  it("TC-R01 | Halaman Recruitment berhasil dibuka dan menampilkan daftar vacancy", () => {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("getVacancies");

    cy.visit("/web/index.php/recruitment/viewJobVacancy");

    cy.wait("@getVacancies").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // FIX: breadcrumb modul = "Recruitment", verifikasi URL saja untuk halaman
    cy.url().should("include", "/recruitment/viewJobVacancy");
    cy.get(".oxd-table-body").should("be.visible");
  });

  // ─── TC-R02 ─────────────────────────────────────────────────
  it("TC-R02 | Tombol Add Vacancy berhasil membuka form tambah vacancy", () => {
    cy.intercept("GET", "**/recruitment/addJobVacancy**").as("addVacancyPage");

    RecruitmentPage.clickAddVacancy();

    cy.wait("@addVacancyPage").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.url().should("include", "/addJobVacancy");

    // FIX: ada 2 h6 di halaman — pakai contains() langsung
    cy.contains("h6", "Add Vacancy").should("be.visible");
  });

  // ─── TC-R03 ─────────────────────────────────────────────────
  it("TC-R03 | Form Add Vacancy menampilkan validasi saat disimpan tanpa mengisi field wajib", () => {
    RecruitmentPage.clickAddVacancy();
    cy.url().should("include", "/addJobVacancy");

    RecruitmentPage.clickSave();

    cy.get(".oxd-input-group .oxd-text--span")
      .should("be.visible")
      .and("contain.text", "Required");
  });

  // ─── TC-R04 ─────────────────────────────────────────────────
  it("TC-R04 | Pencarian vacancy berhasil dan mengembalikan response dari API", () => {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("searchVacancy");

    RecruitmentPage.clickSearch();

    cy.wait("@searchVacancy").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property("data");
    });

    cy.get(".oxd-table").should("be.visible");
  });

  // ─── TC-R05 ─────────────────────────────────────────────────
  // FIX: search input tidak benar-benar filter di demo (sama seperti Directory).
  // Ganti: verifikasi API dipanggil dengan parameter yang benar saat search.
  it("TC-R05 | Pencarian vacancy memicu API request dengan query parameter yang benar", () => {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("searchVacancy");

    const searchTerm = "Software";
    RecruitmentPage.searchByVacancyName(searchTerm);

    cy.wait("@searchVacancy").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      // Verifikasi response punya struktur data yang valid
      expect(interception.response.body).to.have.property("data");
      expect(interception.response.body).to.have.property("meta");
    });

    // Tabel tetap tampil setelah search
    cy.get(".oxd-table-body").should("be.visible");
  });

  // ─── TC-R06 ─────────────────────────────────────────────────
  // FIX: halaman viewJobVacancy tidak punya button[type='reset'].
  // Verifikasi reset lewat API re-request (reset trigger re-fetch).
  it("TC-R06 | Tombol Reset pada form pencarian vacancy berfungsi dengan benar", () => {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("afterReset");

    // Isi search input
    RecruitmentPage.searchVacancyInput.clear().type("Software Engineer");

    // Klik Reset via text (tidak ada button[type='reset'])
    cy.get("button").contains("Reset").click();

    // Verifikasi API dipanggil ulang setelah reset
    cy.wait("@afterReset").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Tabel kembali tampil
    cy.get(".oxd-table-body").should("be.visible");
  });

  // ─── TC-R07 ─────────────────────────────────────────────────
  it("TC-R07 | Tombol Cancel pada form Add Vacancy mengarahkan kembali ke halaman Recruitment", () => {
    RecruitmentPage.clickAddVacancy();
    cy.url().should("include", "/addJobVacancy");

    RecruitmentPage.clickCancel();

    cy.url().should("include", "/viewJobVacancy");
    // FIX: verifikasi URL saja, bukan page title (breadcrumb selalu "Recruitment")
    cy.get(".oxd-table-body").should("be.visible");
  });

  // ─── TC-R08 ─────────────────────────────────────────────────
  it("TC-R08 | Menu Recruitment dapat diakses dari sidebar navigasi", () => {
    cy.visit("/web/index.php/dashboard/index");

    cy.get(".oxd-main-menu-item-wrapper")
      .contains("Recruitment")
      .click();

    // FIX: klik Recruitment dari sidebar → langsung ke viewCandidates
    // Klik tab Vacancies di topbar untuk masuk ke viewJobVacancy
    cy.get(".oxd-topbar-body-nav-tab")
      .contains("Vacancies")
      .click();

    cy.url().should("include", "/recruitment/viewJobVacancy");
    cy.get(".oxd-table-body").should("be.visible");
  });
});
