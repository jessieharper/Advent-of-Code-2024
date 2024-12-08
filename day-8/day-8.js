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

  let positions = [];
  for (let line of lines) {
    for (let char of line) {
      if (char !== ".") {
        positions.push([char, lines.indexOf(line), line.indexOf(char)]);
      }
    }
  }

  let groupedAntennas = {};
  positions.forEach(([freq, x, y]) => {
    if (!groupedAntennas[freq]) {
      groupedAntennas[freq] = [];
    }
    groupedAntennas[freq].push([x, y]);
  });

  let antinodes = new Set();

  for (const frequency in groupedAntennas) {
    let positionsForFrequency = groupedAntennas[frequency];

    // fetch n and n+1 positions:
    for (let i = 0; i < positionsForFrequency.length; i++) {
      for (let j = i + 1; j < positionsForFrequency.length; j++) {
        let [x1, y1] = positionsForFrequency[i];
        let [x2, y2] = positionsForFrequency[j];

        let midpointX = (x1 + x2) / 2;
        let midpointY = (y1 + y2) / 2;

        // Make sure midpoint is a whole number
        let distance1 = x1 - midpointX + (y1 - midpointY);
        let distance2 = x2 - midpointX + (y2 - midpointY);
        console.log("here", distance1, distance2);

        if (distance1 === 2 * distance2 || distance2 === 2 * distance1) {
          antinodes.add(`${midpointX},${midpointY}`);
        }
      }
    }
  }

  console.log(antinodes);
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});
