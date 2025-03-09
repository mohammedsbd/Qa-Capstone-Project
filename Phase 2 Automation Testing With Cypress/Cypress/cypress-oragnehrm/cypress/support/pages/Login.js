class Login {
  visit() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  }

  enterUsername(username) {
    cy.get('input[name="username"]').type(username);
  }

  enterPassword(password) {
    cy.get('input[name="password"]').type(password);
  }

  clickLogin() {
    cy.get(".oxd-button").click();
  }

  verifyDashboard() {
    cy.url().should("include", "/dashboard/index");
    cy.get(".oxd-userdropdown-tab").click();
    cy.get(":nth-child(4) > .oxd-userdropdown-link").click();
  }
  verifyLoginSuccess() {
    cy.url().should("include", "/dashboard/index");
  }

  verifyErrorMessage() {
    cy.get(".oxd-alert-content > .oxd-text")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  }
  verifyRequiredMessage() {
    cy.contains("Required").should("be.visible");
  }
}

export default new Login();
