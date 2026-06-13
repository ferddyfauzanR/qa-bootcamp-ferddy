// ─── Custom Command: Login via UI ────────────────────────────────────────────
Cypress.Commands.add("loginByUI", (username, password) => {
  cy.visit("/web/index.php/auth/login");
  cy.get("input[name='username']").clear().type(username);
  cy.get("input[name='password']").clear().type(password);
  cy.get("button[type='submit']").click();
});

// ─── Custom Command: Login via Session (lebih cepat) ─────────────────────────
Cypress.Commands.add("loginAsAdmin", () => {
  cy.session("adminSession", () => {
    cy.visit("/web/index.php/auth/login");
    cy.get("input[name='username']").clear().type("Admin");
    cy.get("input[name='password']").clear().type("admin123");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
  });
});
