const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.csv");
const readStream = fs.createReadStream(filePath);

let data = "";

readStream.on("data", (chunk) => {
  data += chunk;
});

readStream.on("end", () => {
  const lines = data.trim().split("\n");
  const parsedData = lines.map((line) => line.trim().split(/\s+/).map(Number));

  let leftSide = [];
  let rightSide = [];

  parsedData.forEach((arr) => {
    leftSide.push(arr[0]);
    rightSide.push(arr[1]);
  });

  leftSide.sort();
  rightSide.sort();

  let differences = [];

  for (let i = 0; i < leftSide.length; i++) {
    differences.push(
      rightSide[i] > leftSide[i]
        ? rightSide[i] - leftSide[i]
        : leftSide[i] - rightSide[i]
    );
  }

  const testLeft = [3, 4, 2, 1, 3, 3];
  const testRight = [4, 3, 5, 3, 9, 3];

  let similarities = 0;
  leftSide.forEach((num) => {
    similarities += num * rightSide.filter((a) => a === num).length;
  });

  console.log(similarities);
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
