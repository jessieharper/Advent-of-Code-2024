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

  function processInstructions(data) {
    let mulEnabled = true;
    const regexMul = /mul\((\d+),(\d+)\)/g;
    let position = 0;

    while (position < data.length) {
      // Look for do() or don't()
      if (data.slice(position).match(/don\'t\(\)/)) {
        mulEnabled = false;
        position += 6;
      } else if (data.slice(position).match(/do\(\)/)) {
        mulEnabled = true;

        position += 3;
      } else {
        // Look for mul(x,y)
        const mulMatch = data.slice(position).match(regexMul);
        if (mulMatch) {
          const numbers = mulMatch[0].match(/\d+/g);
          const test3 = numbers.map((num) => +num);

          if (mulEnabled) {
            mul(test3);
          }

          position += mulMatch[0].length;
        } else {
          position++;
        }
      }
    }

    return total;
  }

  console.log(processInstructions(data));

  // const test = [...data.matchAll(/mul\(\d+,\d+\)/g)];

  // test.forEach((arr) => {
  //   const numbers = arr[0].match(/\d+/g);
  //   const test2 = numbers.map((num) => +num);
  //   mul(test2);
  // });

  //regexr to match mul(/d+/,/d+/) - no spaces
  //mul(a, b) function
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
