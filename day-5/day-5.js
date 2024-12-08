const fs = require("fs");
const path = require("path");

const filePathData = path.join(__dirname, "data.csv");
const filePathRules = path.join(__dirname, "rules.csv");

let data = "";
let rules = "";

const readStreamData = fs.createReadStream(filePathData);
const readStreamRules = fs.createReadStream(filePathRules);

readStreamData.on("data", (chunk) => {
  data += chunk;
});

readStreamRules.on("data", (chunk) => {
  rules += chunk;
});

let dataReadComplete = false;
let rulesReadComplete = false;

const checkCompletion = () => {
  if (dataReadComplete && rulesReadComplete) {
    processFiles();
  }
};

readStreamData.on("end", () => {
  dataReadComplete = true;
  checkCompletion();
});

readStreamRules.on("end", () => {
  rulesReadComplete = true;
  checkCompletion();
});

readStreamData.on("error", (err) => {
  console.error("Error reading data file:", err.message);
});

readStreamRules.on("error", (err) => {
  console.error("Error reading rules file:", err.message);
});

const processFiles = () => {
  const parsedData = data
    .trim()
    .split("\n")
    .map((el) => el.split(","));
  const parsedRules = rules
    .trim()
    .split("\n")
    .map((el) => el.split("|"));

  let total = 0;

  function addMiddlePages(pages) {
    const middleIndex = Math.floor(pages.length / 2);
    total += +pages[middleIndex];
  }

  function isValid(numArr) {
    for (const ruleArr of parsedRules) {
      if (numArr.includes(ruleArr[0]) && numArr.includes(ruleArr[1])) {
        if (numArr.indexOf(ruleArr[0]) > numArr.indexOf(ruleArr[1])) {
          return false;
        }
      }
    }
    return true;
  }

  for (const numArr of parsedData) {
    if (isValid(numArr)) addMiddlePages(numArr);
  }

  console.log(total);
};
