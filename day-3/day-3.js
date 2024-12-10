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
    const regexMul = /mul\((\d+),(\d+)\)/g;
    const regexDont = /don\'t\(\)/;
    const regexDo = /do\(\)/;

    let position = 0;

    while (data.length > 0) {
      let disabled = data.match(regexDont).index;
      let enabled = data.match(regexDo).index;

      if (disabled && disabled < enabled) {
        position = disabled.index;

        let mulMatch = data.slice(0, position).match(regexMul);
        if (mulMatch) {
          const numbers = mulMatch[0].match(/\d+/g);
          const test3 = numbers.map((num) => +num);
          mul(test3);
        }
        data = data.slice(position + 7);
      } else {
        console.log(enabled);
        data = data.slice(position, enabled.index + 4);
        console.log(data);
        return data;
      }
    }
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
