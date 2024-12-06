const { count } = require("console");
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
  const word = "MAS";
  wordSearch(lines, word);

  function wordSearch(grid, word) {
    const totalRows = grid.length;
    const totalCols = grid[0].length;
    const wordLength = word.length;
    // [row, col]
    // [Right, Left, Up, Down, Up Right, Down Right, Up Left, Down Left ]
    const directions = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
    ];

    function isValid(row, col, rowDirection, colDirection) {
      for (let i = 0; i < wordLength; i++) {
        // Add the current row/col index to the index of the letter in XMAS you're currently looking for, then multiply by 1, 0, -1
        // If row === 2, i === 1, rowDirection === -1 -> newRow = 1 (going backwards)
        // If row === 0 i === 1, rowDirection === -1 -> function returns false (gone off the grid!)
        const newRow = row + i * rowDirection;
        const newCol = col + i * colDirection;
        if (
          newRow < 0 ||
          newRow >= totalRows ||
          newCol < 0 ||
          newCol >= totalCols ||
          grid[newRow][newCol] !== word[i]
        ) {
          return false;
        }
      }
      return true;
    }

    let totalWords = 0;
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        for (const [rowDirection, colDirection] of directions) {
          if (isValid(row, col, rowDirection, colDirection)) {
            totalWords++;
          }
        }
      }
    }

    console.log(totalWords);
  }
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
