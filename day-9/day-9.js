const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.csv");
const readStream = fs.createReadStream(filePath);

let data = "";

readStream.on("data", (chunk) => {
  data += chunk;
});

readStream.on("end", () => {
  let blocks = [];
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    if (i % 2 === 0) {
      x++;
      for (let j = data[i]; j > 0; j--) {
        blocks.push(x - 1);
      }
    } else {
      for (let j = data[i]; j > 0; j--) {
        blocks.push(".");
      }
    }
  }
  console.log(blocks);

  function flipFileBlocks(blocks) {
    let lastNumIndex = blocks.findLastIndex((el) => el !== ".");
    let firstDotIndex = blocks.findIndex((el) => el === ".");

    while (firstDotIndex < lastNumIndex) {
      if (firstDotIndex < lastNumIndex) {
        [blocks[firstDotIndex], blocks[lastNumIndex]] = [
          blocks[lastNumIndex],
          blocks[firstDotIndex],
        ];
        firstDotIndex = blocks.findIndex((el) => el === ".");
        lastNumIndex = blocks.findLastIndex((el) => el !== ".");
      }
    }
    return blocks;
  }

  const array = flipFileBlocks(blocks);
  let result = 0;

  for (let i = 0; i < array.length; i++) {
    if (array[i] !== ".") {
      result += +array[i] * i;
    }
  }

  console.log(result);
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
