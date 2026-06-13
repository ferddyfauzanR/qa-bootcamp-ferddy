class DirectoryPage {
  // ─── Selectors ───────────────────────────────────────────────
  get directoryMenuLink() {
    return cy.get(".oxd-main-menu-item").contains("Directory");
  }

  get pageTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb h6");
  }

  // FIX: pakai input[placeholder] atau oxd-input langsung index 0
  // Di halaman Directory, search form hanya punya 1 text input (nama karyawan)
  get searchNameInput() {
    return cy.get(".oxd-input:not([type='hidden'])").first();
  }

  get jobTitleDropdown() {
    return cy.get(".oxd-select-text").eq(0);
  }

  get locationDropdown() {
    return cy.get(".oxd-select-text").eq(1);
  }

  get searchButton() {
    return cy.get("button[type='submit']");
  }

  get employeeCards() {
    return cy.get(".orangehrm-directory-card");
  }

  get noRecordsFoundText() {
    return cy.get(".orangehrm-horizontal-padding span");
  }

  get employeeCardNames() {
    return cy.get(".orangehrm-directory-card-header");
  }

  get employeeCardJobTitle() {
    return cy.get(".orangehrm-directory-card-subtitle");
  }

  get resetButton() {
    return cy.get("button[type='reset']");
  }

  // ─── Actions ─────────────────────────────────────────────────
  visit() {
    cy.visit("/web/index.php/directory/viewDirectory");
  }

  clickDirectoryMenu() {
    this.directoryMenuLink.click();
  }

  searchByName(name) {
    this.searchNameInput.clear().type(name);
    this.searchButton.click();
  }

  selectJobTitle(title) {
    this.jobTitleDropdown.click();
    cy.get(".oxd-select-dropdown .oxd-select-option span")
      .contains(title)
      .click();
  }

  selectLocation(location) {
    this.locationDropdown.click();
    cy.get(".oxd-select-dropdown .oxd-select-option span")
      .contains(location)
      .click();
  }

  clickSearch() {
    this.searchButton.click();
  }

  clickReset() {
    this.resetButton.click();
  }
}

export default new DirectoryPage();
