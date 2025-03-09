import Login from "../support/pages/Login";
import Vacancy from "../support/pages/Vaccancy";

describe("Orange HRM Recruitment Module Vacancy Menu Testing", () => {
  // Login before each test
  beforeEach(() => {
    cy.fixture("loginData").then((userData) => {
      Login.visit();
      Login.enterUsername(userData.Username);
      Login.enterPassword(userData.Password);
      Login.clickLogin();
      Login.verifyLoginSuccess();
      Vacancy.visit();
    });
  });

  it.only("Test Adding Vacancy", function () {
    Vacancy.clickAddVacancy();

    // Loop through Vacancy data
    cy.fixture("vacancy").each((data) => {
      Vacancy.fillVacancyForm(data);
      Vacancy.submitForm();

      // Assert if the Vacancy was added successfully
      if (data.Expected === "Success") {
        Vacancy.verifySuccessMessage();
      } else {
        Vacancy.verifyErrorMessage();
      }

      Vacancy.visitAddVacancy();
    });
  });

  it.only("Test Searching Functionality of Vacancy Menu", function () {
    cy.fixture("searchVacancy").each((data) => {
      Vacancy.fillVacancySearch(data);
    });
  });
  it("Test Update Functionality of Vacancy Menu", function () {
    cy.fixture("updateVacancy").each((data) => {
      Vacancy.updateVacancy(data);
    });
  });
  it("Test delete Functionality of Vacancy Menu", function () {
    cy.fixture("updateVacancy").each((data) => {
      Vacancy.deleteSingleVacancy(data);
    });
  });
  it("Test Multiple Vacancy delete Functionality of Vacancy Menu", function () {
    cy.fixture("updateVacancy").each((data) => {
      Vacancy.deleteMultipleVacancy(data);
    });
  });
});
