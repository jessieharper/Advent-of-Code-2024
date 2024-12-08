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
  const parsedData = lines
    .map((line) => line.trim().split(/\s+/))
    .map((el) => {
      return [el[0], ...el.slice(1).map(Number)];
    });

  parsedData.map((element) => {
    element[0] = +element[0].replace(":", "");
  });

  function isValidEquation(data) {
    const results = [];

    data.forEach((line) => {
      const target = line[0]; // first num
      const numbers = line.slice(1); // rest of the nums

      const numOfOperators = numbers.length - 1; // n - 1 (number of operators needed)
      const combinations = generateCombinations(
        ["+", "*", "||"],
        numOfOperators
      );
      // e.g if numOfOperators === 2: [["+", "+"], ["+", "*"], ["*", "+"], ["*", "*"]]
      // e.g if numOfOperators === 3:
      //  [
      //    ["+", "+", "+"],
      //    ["+", "+", "*"],
      //    ["+", "*", "+"],
      //    ["+", "*", "*"],
      //    ["*", "+", "+"],
      //    ["*", "+", "*"],
      //    ["*", "*", "+"],
      //    ["*", "*", "*"]
      //  ]

      function generateCombinations(operators, numOfOperators) {
        if (numOfOperators === 0) return [[]]; // not enough positions left for operators
        const smallerCombinations = generateCombinations(
          operators,
          numOfOperators - 1
        );

        // 	["+", ...["+"]] → ["+", "+"] || ["+", ...["*"]] → ["+", "*"] && ["*", ...["+"]] → ["*", "+"] ||
        //  ["*", ...["*"]] → ["*", "*"]
        return operators.flatMap((newOperator) =>
          smallerCombinations.map((combination) => [
            newOperator,
            ...combination,
          ])
        );
      }

      let isValid = false;

      for (const operators of combinations) {
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
          if (operators[i] === "+") {
            result += numbers[i + 1];
          } else if (operators[i] === "*") {
            result *= numbers[i + 1];
          } else if (operators[i] === "||") {
            const concat = result.toString() + numbers[i + 1].toString();
            result = +concat;
          }
        }

        if (result === target) {
          isValid = true;
          break;
        }
      }

      if (isValid) {
        results.push(target);
      }
    });

    return results.reduce((a, b) => a + b, 0);
  }

  console.log(isValidEquation(parsedData));
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
