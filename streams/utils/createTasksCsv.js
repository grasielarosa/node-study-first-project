import fs from "node:fs";

const data = [
  { Title: "Task 1", Description: "Complete assignment" },
  { Title: "Task 2", Description: "Attend meeting" },
  { Title: "Task 3", Description: "Submit report" },
  { Title: "Task 4", Description: "Call John Doe" },
  { Title: "Task 5", Description: "Study for test" },
  { Title: "Task 6", Description: "Clean house" },
];

const csvHeader = "Title,Description\n";

const csvContent = data
  .map((item) => `${item.Title},${item.Description}`)
  .join("\n");

const csvFilePath = "../tasks.csv";

fs.writeFile(csvFilePath, csvHeader + csvContent, (err) => {
  if (err) {
    console.error("Error writing to CSV file:", err);
  } else {
    console.log(
      "Table with title and description created in tasks.csv successfully."
    );
  }
});
