const { defineConfig } = require("cypress");
const xlsx = require("xlsx");

module.exports = defineConfig({

  // projectId: "8icpzb",
  projectId: "ctwa9w",
  reporter: "cypress-mochawesome-reporter",
  video: true,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      retries: 1,
        on("task", {
          readExcel({ filePath, sheetName }) {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[sheetName];
            return xlsx.utils.sheet_to_json(sheet);
          },
        });
    },
  },
});



