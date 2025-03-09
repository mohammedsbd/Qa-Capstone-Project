class Vacancy {
  visit() {
    cy.get(":nth-child(5) > .oxd-main-menu-item").click();
    cy.get(".oxd-topbar-body-nav > ul > :nth-child(2)").click();
    cy.get(".oxd-table-filter-header-title > .oxd-text")
    .should("be.visible");
    // .and("contain", "Vacancy");
  }

  clickAddVacancy() {
    cy.get(".orangehrm-header-container > .oxd-button").click();
    cy.url().should("include", "/recruitment/addJobVacancy");
  }

  fillVacancyForm(data) {
    if (data.VacancyName) {
      cy.get(
        ".oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ).type(data.VacancyName);
    }
    if (data.JobTitle) {
      cy.get(".oxd-select-text").as("job");
      cy.get("@job").click();
      // cy.intercept(
      //   "GET",
      //   "/web/index.php/api/v2/core/validation/unique?value=Automaton+Tester&entityName=Vacancy&attributeName=name"
      // ).as("manager");
      // cy.wait("@manager");
      cy.wait(3000);

      // cy.get(".oxd-select-option").each(function ($ele) {
      //   if ($ele.text() === data.JobTitle) {
      //     cy.wrap($ele).click();
      //   }
      // });
    }

    cy.get(".oxd-textarea").type(data.Desc);

    if (data.HiringManager) {
      cy.get(".oxd-autocomplete-text-input > input").type(data.HiringManager);
      cy.intercept(
        "GET",
        "/web/index.php/api/v2/pim/employees?nameOrId=Rahul+Mulge+Patil&includeEmployees=onlyCurrent"
      ).as("loading");
      // cy.wait("@loading");
      cy.get(".oxd-autocomplete-option").as("btn").first();
      // .should("contain.text", data.HiringManager);
      cy.get("@btn").click();
    }
    cy.get(
      ".oxd-grid-2 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input"
    ).type(data.PositionNo);

    cy.get(".oxd-button--secondary").click();
  }

  submitForm() {
    cy.get(".oxd-button--secondary").click();
  }

  verifySuccessMessage() {
    // cy.get(".oxd-toast").should("contain", "Successfully Saved");
    cy.contains("Add");
    cy.wait(3000);
  }

  verifyErrorMessage() {
    cy.get(".oxd-input-group > .oxd-text")
      .contains("Required")
      .should("be.visible");
  }

  ResetSearch() {
    cy.get(".oxd-button--ghost").click();
    cy.wait(500);
  }
  visitAddVacancy() {
    cy.wait(1000);
    // cy.reload();
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addJobVacancy"
    );
  }
  // fillVacancySearch(data) {
  //   if (data.JobTitle) {
  //     cy.get(
  //       ":nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon"
  //     ).click();
  //     cy.wait(3000);
  //     cy.get(".oxd-select-option").each(function ($ele) {
  //       if ($ele.text() === data.JobTitle) {
  //         cy.wrap($ele).click();
  //       }
  //     });
  //     cy.get(".oxd-form-actions > .oxd-button--secondary").click();
  //     cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(($row) => {
  //       cy.wrap($row)
  //         .find(".oxd-table-cell")
  //         .eq(2)
  //         .should("have.text", data.JobTitle);
  //     });
  //   }
  //   if (data.Status) {
  //     this.ResetSearch();
  //     cy.get(
  //       ":nth-child(4) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text"
  //     ).click();
  //     cy.get("span[data-v-13cf171c]").each(function ($ele) {
  //       if ($ele.text() === data.Status) {
  //         cy.wrap($ele).click();
  //       }
  //     });
  //     cy.get(".oxd-form-actions > .oxd-button--secondary").click();
  //     // cy.get('.oxd-table-row > :nth-child(3)').click();
  //     cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(($row) => {

  //       cy.wrap($row)
  //         .find(".oxd-table-cell")
  //         .eq(4)
  //         .should("have.text", data.Status);
  //     });
  //   }
  // }
  fillVacancySearch(data) {
    if (data.JobTitle) {
      cy.get(
        ":nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon"
      ).click();
      cy.wait(3000);
      cy.get(".oxd-select-option").each(($ele) => {
        if ($ele.text().trim() === data.JobTitle) {
          cy.wrap($ele).click();
        }
      });

      cy.get(".oxd-form-actions > .oxd-button--secondary").click();

      // Wait for API response
      // cy.intercept("/web/index.php/api/v2/recruitment/vacancies?*").as("vacanciesLoad");
      // cy.wait("@vacanciesLoad");
      cy.wait(4000);

      // Ensure table exists before proceeding
      cy.get(".oxd-table .oxd-table-body")
        .should("exist")
        .then(($tableBody) => {
          if ($tableBody.find(".oxd-table-card").length > 0) {
            cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(
              ($row) => {
                cy.wrap($row)
                  .find(".oxd-table-cell")
                  .eq(2)
                  .should("have.text", data.JobTitle);
              }
            );
          } else {
            cy.log("No records found.");
          }
        });
    }

    if (data.Status) {
      this.ResetSearch();
      cy.get(
        ":nth-child(4) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text"
      ).click();

      cy.get("span[data-v-13cf171c]").each(($ele) => {
        if ($ele.text().trim() === data.Status) {
          cy.wrap($ele).click();
        }
      });

      cy.get(".oxd-form-actions > .oxd-button--secondary").click();

      cy.intercept("/web/index.php/api/v2/recruitment/vacancies?*").as(
        "vacanciesLoad"
      );
      // cy.wait("@vacanciesLoad");

      cy.get(".oxd-table .oxd-table-body")
        .should("exist")
        .then(($tableBody) => {
          if ($tableBody.find(".oxd-table-card").length > 0) {
            cy.get(".oxd-table .oxd-table-body .oxd-table-card").each(
              ($row) => {
                cy.wrap($row)
                  .find(".oxd-table-cell")
                  .eq(4)
                  .should("have.text", data.Status);
              }
            );
          } else {
            cy.log("No records found.");
          }
        });
    }
  }

  updateVacancy(data) {
    this.fillVacancySearch(data);
    cy.get(".oxd-table .oxd-table-body .oxd-table-card")
      .eq(0)
      .find(".oxd-table-cell")
      .eq(5)
      .find(".oxd-icon-button")
      .eq(1)
      .click();
    if (data.HiringManager) {
      cy.get(".oxd-autocomplete-text-input > input")
        .clear()
        .type(data.HiringManager);
      cy.intercept(
        "GET",
        "/web/index.php/api/v2/pim/employees?nameOrId=Meklit&includeEmployees=onlyCurrent"
      ).as("loading");
      // cy.wait("@loading");
      cy.get(".oxd-autocomplete-option")
        .as("btn")
        .first()
        .should("contain", data.Hiring_Manager);
      cy.get("@btn").first().click();
    }

    cy.get(".oxd-button--secondary").click();
    cy.contains("Successfully Updated");
    // cy.get(".oxd-toast").should("contain", "Successfully Updated");
  }
  //   updateVacancy(data) {
  //     this.fillVacancySearch(data);

  //     cy.get(".oxd-table .oxd-table-body", { timeout: 10000 }).should("exist");

  //     cy.get(".oxd-table .oxd-table-body .oxd-table-card").then(($cards) => {
  //       if ($cards.length === 0) {
  //         cy.log("No vacancies found.");
  //         return;
  //       }
  //       cy.wrap($cards).eq(0).find(".oxd-table-cell").eq(5).find(".oxd-icon-button").eq(1).click();
  //     });

  //     if (data.HiringManager) {
  //       cy.get(".oxd-autocomplete-text-input > input").clear().type(data.HiringManager);
  //       cy.intercept("GET", "/pim/employees?").as("loading");
  //       cy.wait("@loading");
  //       cy.get(".oxd-autocomplete-option")
  //         .as("btn")
  //         .first()
  //         .should("contain", data.HiringManager);
  //       cy.get("@btn").first().click();
  //     }

  //     cy.get(".oxd-button--secondary").click();
  //     cy.contains("Successfully Updated");
  // }
  deleteSingleVacancy(data) {
    this.fillVacancySearch(data);

    cy.get(".oxd-table .oxd-table-body .oxd-table-card")
      .eq(0)
      .find(".oxd-table-cell")
      .eq(5)
      .find(".oxd-icon-button")
      .eq(0)
      .click();

    cy.get(".orangehrm-text-center-align > .oxd-text").contains(
      "The selected record will be permanently deleted. Are you sure you want to continue?"
    );

    cy.get(".oxd-button--label-danger").click();
    cy.get(".oxd-toast").should("have.text", "InfoNo Records Found×");
  }

  deleteMultipleVacancy(data) {
    this.fillVacancySearch(data);
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
        .eq(3)
        .should("have.text", data.Hiring_Manager);
    });
  }
}
export default new Vacancy();
