class RecruitmentPage {
  // ─── Selectors ───────────────────────────────────────────────
  get recruitmentMenuLink() {
    return cy.get(".oxd-main-menu-item").contains("Recruitment");
  }

  // FIX: breadcrumb pertama = "Recruitment" (modul), kedua = nama halaman aktif
  // Pakai selector yang ambil semua teks breadcrumb lalu verifikasi URL saja
  get pageTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb");
  }

  get addButton() {
    return cy.get("button.oxd-button--secondary").contains("Add");
  }

  get vacancyNameInput() {
    return cy.get(".oxd-input:not([type='hidden'])").eq(1);
  }

  get jobTitleDropdown() {
    return cy.get(".oxd-select-text").eq(0);
  }

  get saveButton() {
    return cy.get("button[type='submit']");
  }

  get cancelButton() {
    return cy.get("button[type='button']").contains("Cancel");
  }

  get vacancyTable() {
    return cy.get(".oxd-table-body");
  }

  get vacancyRows() {
    return cy.get(".oxd-table-row--with-border");
  }

  get searchVacancyInput() {
    return cy.get(".oxd-input:not([type='hidden'])").first();
  }

  get searchButton() {
    return cy.get("button[type='submit']");
  }

  // FIX: halaman viewJobVacancy tidak punya button[type='reset']
  // pakai button yang contain text "Reset"
  get resetButton() {
    return cy.get("button").contains("Reset");
  }

  get successToast() {
    return cy.get(".oxd-toast--success");
  }

  // ─── Actions ─────────────────────────────────────────────────
  visit() {
    cy.visit("/web/index.php/recruitment/viewJobVacancy");
  }

  clickRecruitmentMenu() {
    this.recruitmentMenuLink.click();
  }

  clickAddVacancy() {
    this.addButton.click();
  }

  fillVacancyName(name) {
    this.vacancyNameInput.clear().type(name);
  }

  clickSave() {
    this.saveButton.click();
  }

  clickCancel() {
    this.cancelButton.click();
  }

  clickReset() {
    this.resetButton.click();
  }

  clickSearch() {
    this.searchButton.click();
  }

  searchByVacancyName(name) {
    this.searchVacancyInput.clear().type(name);
    this.searchButton.click();
  }
}

export default new RecruitmentPage();
