


import Login from "../support/pages/Login";

describe("Orange HRM Login Module Data Driven Testing with Excel in Cypress", () => {
  before(function () {
    const path = "cypress/fixtures/LoginData.xlsx";
    const sheet_name = "Sheet1";

    cy.readExcelFile({
      filePath: path,  
      sheetName: sheet_name,
    }).then((data) => {
      this.users = data; // Store data in this.users
    });
  });

  beforeEach(() => {
    Login.visit();
  });

  it("Reads login data and performs tests", function () {
    expect(this.users).to.exist;

    this.users.forEach((row) => {
      cy.log(`Username: ${row.Username}, Password: ${row.Password}`);


      if (row.Username) {
        Login.enterUsername(row.Username);
      }
      if (row.Password) {
        Login.enterPassword(row.Password);
      }

      Login.clickLogin();
      cy.wait(3000);

      if (row.Expected === "Pass") {
        Login.verifyDashboard();
      } else if (row.Expected === "Fail") {
        Login.verifyErrorMessage();
      } else {
        Login.verifyRequiredMessage();
        cy.wait(500);
        cy.reload();
      }
    });
  });
});