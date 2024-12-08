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
  const startingDirections = {
    V: [1, 0], // down
    "^": [-1, 0], // up
    ">": [0, 1], // right
    "<": [0, -1], // left
  };

  let startingDirection;
  let startingRow;
  let startingCol;

  // Find the starting position of the guard
  for (let line of lines) {
    for (let char of line) {
      if (startingDirections[char]) {
        startingDirection = startingDirections[char];
        startingRow = lines.indexOf(line);
        startingCol = line.indexOf(char);
      }
    }
  }

  let moveHistory = new Set();

  function moveGuard(grid, col, row, direction, count) {
    const directions = [
      [-1, 0], // up
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
    ];

    const [rowDirection, colDirection] = direction;
    const totalRows = grid.length;
    const totalCols = grid[0].length;

    while (true) {
      const newRow = row + rowDirection;
      const newCol = col + colDirection;
      console.log(
        `At row: ${row}, col: ${col}, Moving to: row ${newRow}, col ${newCol}, Count: ${count}`
      );

      // Check if out of bounds
      if (
        newRow < 0 ||
        newRow >= totalRows ||
        newCol < 0 ||
        newCol >= totalCols
      ) {
        return count;
      }

      if (grid[newRow][newCol] === "#") {
        console.log(
          `Blocked at: row ${newRow}, col ${newCol}. Changing direction.`
        );
        // Blocked, gotta change direction
        const directionIndex = directions.findIndex(
          (direction) =>
            direction[0] === rowDirection && direction[1] === colDirection
        );
        const newDirection =
          directions[(directionIndex + 1) % directions.length];
        return moveGuard(grid, col, row, newDirection, count);
      }

      moveHistory.add(`${row},${col}`);
      row = newRow;
      col = newCol;

      if (!moveHistory.has(`${newRow},${newCol}`)) {
        moveHistory.add(`${newRow},${newCol}`);
        count++;
      }
    }
  }

  const result = moveGuard(
    lines,
    startingCol,
    startingRow,
    startingDirection,
    1
  );
  console.log("Guard moved:", result, "steps.");
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
