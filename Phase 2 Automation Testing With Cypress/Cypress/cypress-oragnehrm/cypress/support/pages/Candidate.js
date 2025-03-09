class Candidate {
  visit() {
    cy.get(":nth-child(5) > .oxd-main-menu-item").click();
    cy.get(".oxd-table-filter-header-title > .oxd-text")
      .should("be.visible")
      .and("contain", "Candidate");
  }

  clickAddCandidate() {
    cy.get(".orangehrm-header-container > .oxd-button").click();
    cy.url().should("include", "/recruitment/addCandidate");
  }

  fillCandidateForm(data) {
    if (data.FirstName) {
      cy.get('input[name="firstName"]').type(data.FirstName);
    }
    if (data.LastName) {
      cy.get('input[name="lastName"]').type(data.LastName);
    }

    // Select Vacancy
    cy.get(".oxd-select-text").click();
    cy.get("span[data-v-13cf171c]").each(function ($ele) {
      if ($ele.text() === data.Vacancy) {
        cy.wrap($ele).click();
      }
    });

    // Fill Email and Contact
    if (data.Email) {
      cy.get(
        ":nth-child(3) > .oxd-grid-3 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ).type(data.Email);
    }
    cy.get(
      ".oxd-grid-3 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input"
    ).type(data.Contact);

    // Attach file
    cy.get(".oxd-file-input-div").attachFile(data.Resume);
  }

  submitForm() {
    cy.get(".oxd-button--secondary").click();
  }

  verifySuccessMessage() {
    cy.get(".oxd-toast").should("contain", "Successfully Saved");
  }

  verifyErrorMessage() {
    cy.contains("Required").should("be.visible");
  }
  verifyIncorrectMessage() {
    cy.contains("Expected format: admin@example.com").should("be.visible");
  }
  ResetSearch() {
    cy.get(".oxd-button--ghost").click();
    // cy.visit(
    //   "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate"
    // );
    cy.wait(500);
  }
  visitAddCandidate() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate"
    );
    cy.wait(500);
  }
  fillCandidateSearch(data) {
    if (data.Name) {
      cy.get(".oxd-autocomplete-text-input > input").type(data.Name);
      cy.intercept(
        "GET",
        "/web/index.php/api/v2/recruitment/candidates?candidateName=John"
      ).as("loading");
      cy.wait("@loading");
      cy.get(".oxd-autocomplete-option")
        .as("btn")
        .first()
        .should("contain.text", data.CandidateName);

      cy.get("@btn").first().click();

      // cy.get(".oxd-autocomplete-option").each(($el) => {
      //   if ($el.text() === data.CandidateName) {
      //     cy.wrap($el).as("button").click();
      //   }
      // });

      cy.get(".oxd-form-actions > .oxd-button--secondary").click();
      // cy.get(".oxd-form-actions > .oxd-button--secondary").click();
      cy.wait(4000);
      cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(($row) => {
        cy.wrap($row)
          .find(".oxd-table-cell")
          .eq(2)
          .should("have.text", data.CandidateName);
      });
    }
    if (data.Status) {
      this.ResetSearch();
      cy.get(
        ":nth-child(4) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text"
      ).click();
      cy.get("span[data-v-13cf171c]").each(function ($ele) {
        if ($ele.text() === data.Status) {
          cy.wrap($ele).click();
        }
      });
      cy.get(".oxd-form-actions > .oxd-button--secondary").click();
      cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(($row) => {
        cy.wrap($row)
          .find(".oxd-table-cell")
          .eq(5)
          .should("have.text", data.Status);
      });
    }
  }
  updateCandidate(data) {
    this.fillCandidateSearch(data);
    cy.get(".oxd-table .oxd-table-body .oxd-table-card")
      .eq(0)
      .find(".oxd-table-cell")
      .eq(6)
      .find(".oxd-icon-button")
      .eq(0)
      .click();
    cy.get(".oxd-switch-input").click();
    if (data.FirstName) {
      cy.get('input[name="firstName"]').clear().type(data.FirstName);
    }
    if (data.Email) {
      cy.get(
        ":nth-child(3) > .oxd-grid-3 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      )
        .clear()
        .type(data.Email);
    }
    cy.get(".oxd-form-actions > .oxd-button").click();
    cy.get(".oxd-toast").should("contain", "Successfully Updated");
  }
  deleteSingleCandidate(data) {
    this.fillCandidateSearch(data);

    cy.get(".oxd-table .oxd-table-body .oxd-table-card")
      .eq(0)
      .find(".oxd-table-cell")
      .eq(6)
      .find(".oxd-icon-button")
      .eq(1)
      .click();

    cy.get(".orangehrm-text-center-align > .oxd-text").contains(
      "The selected record will be permanently deleted. Are you sure you want to continue?"
    );

    cy.get(".oxd-button--label-danger").click();
    cy.get(".oxd-toast").should("have.text", "InfoNo Records Found×");
  }
  deleteMultipleCandidate(data) {
    this.fillCandidateSearch(data);

    cy.get(".oxd-table .oxd-table-body .oxd-table-card")
      .find(".oxd-table-cell")
      .eq(0)
      .find('input[type="checkbox"]')
      .check({ force: true })
      .should("be.checked");

    cy.get(".orangehrm-horizontal-padding > div > .oxd-button").click();

    cy.get(".orangehrm-text-center-align > .oxd-text").contains(
      "The selected record will be permanently deleted. Are you sure you want to continue?"
    );

    cy.get(".orangehrm-modal-footer > .oxd-button--ghost").click();
    cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(($row) => {
      cy.wrap($row)
        .find(".oxd-table-cell")
        .eq(2)
        .should("have.text", data.CandidateName);
    });
  }
}

export default new Candidate();
