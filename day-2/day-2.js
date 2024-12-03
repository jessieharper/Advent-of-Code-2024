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

  let total = 0;

  parsedData.forEach((arr) => {
    let safe = false;

    // Check if the array is strictly increasing or strictly decreasing
    const isIncreasing = arr.every(
      (value, i) => i === 0 || value >= arr[i - 1]
    );
    const isDecreasing = arr.every(
      (value, i) => i === 0 || value <= arr[i - 1]
    );

    if (isIncreasing || isDecreasing) {
      safe = true;
    } else {
      // Check if removing one element can make the array safe
      for (let i = 0; i < arr.length; i++) {
        const modifiedArr = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const isModifiedIncreasing = modifiedArr.every(
          (val, i) => i === 0 || val >= modifiedArr[i - 1]
        );
        const isModifiedDecreasing = modifiedArr.every(
          (val, i) => i === 0 || val <= modifiedArr[i - 1]
        );

        if (isModifiedIncreasing || isModifiedDecreasing) {
          safe = true;
          break;
        }
      }
    }

    if (safe) {
      let problemDampener = 0;
      let workingArr = [...arr];

      // Check differences between adjacent numbers
      for (let i = 0; i < workingArr.length - 1; i++) {
        const difference = Math.abs(workingArr[i] - workingArr[i + 1]);
        if (difference > 3 || difference === 0) {
          problemDampener++;
          workingArr.splice(i, 1);
          i = -1;
        }
      }

      if (problemDampener <= 1) {
        total++;
      }
    }
  });

  console.log(total);
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
