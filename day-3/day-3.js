const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "test-data.csv");
const readStream = fs.createReadStream(filePath);

let data = "";

readStream.on("data", (chunk) => {
  data += chunk;
});

readStream.on("end", () => {
  let total = 0;
  function mul(arr) {
    total += arr.reduce((a, b) => a * b);
  }
  let split = data.split(/dont\'t\(\)/g);
  console.log(split);
  const test = [...data.matchAll(/mul\(\d+,\d+\)/g)];

  test.forEach((arr) => {
    const numbers = arr[0].match(/\d+/g);
    const test2 = numbers.map((num) => +num);
    mul(test2);
  });

  console.log(total);
  //regexr to match mul(/d+/,/d+/) - no spaces
  //mul(a, b) function
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
