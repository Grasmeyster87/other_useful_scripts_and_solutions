const fs = require("fs");

fs.watch("./", (eventType, filename) => {
  console.log(`Файл ${filename} був змінений (${eventType})`);
});