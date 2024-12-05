const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "test-data.csv");
const readStream = fs.createReadStream(filePath);

let data = "";

readStream.on("data", (chunk) => {
  data += chunk;
});

readStream.on("end", () => {
  const lines = data.trim().split("\n");
  console.log(lines);
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
