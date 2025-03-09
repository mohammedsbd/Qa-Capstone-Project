import Login from "../support/pages/Login";
import Candidate from "../support/pages/Candidate";

describe("Orange HRM Recruitment Module Candidate Menu Testing", () => {
  // Login before each test
  beforeEach(() => {
    cy.fixture("loginData").then((userData) => {
      Login.visit();
      Login.enterUsername(userData.Username);
      Login.enterPassword(userData.Password);
      Login.clickLogin();
      Login.verifyLoginSuccess();
      Candidate.visit();
    });
  });

  it("Test Adding Candidates", function () {
    Candidate.clickAddCandidate();

    // Loop through candidate data
    cy.fixture("candidate").each((data) => {
      Candidate.fillCandidateForm(data);
      Candidate.submitForm();

      // Assert if the candidate was added successfully
      if (data.Expected === "Success") {
        Candidate.verifySuccessMessage();
      } else if (data.Expected === "IncorrectFormat") {
        Candidate.verifyIncorrectMessage();
      } else {
        Candidate.verifyErrorMessage();
      }

      Candidate.visitAddCandidate();
    });
  });

  it("Test Searching Functionality of Candidate Menu", function () {
    cy.fixture("searchData").each((data) => {
      Candidate.fillCandidateSearch(data);
    });
  });
  it.only("Test Update Functionality of Candidate Menu", function () {
    cy.fixture("updateData").each((data) => {
      Candidate.updateCandidate(data);
    });
  });
  it.only("Test delete Functionality of Candidate Menu", function () {
    cy.fixture("updateData").each((data) => {
      Candidate.deleteSingleCandidate(data);
    });
  });
  // it("Test Multiple Candidate delete Functionality of Candidate Menu", function () {
  //   cy.fixture("updateData").each((data) => {
  //     Candidate.deleteMultipleCandidate(data);
  //   });
  // });
});
