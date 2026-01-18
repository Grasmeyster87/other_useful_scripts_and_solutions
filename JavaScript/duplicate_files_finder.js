const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const hashes = {};

function hashFile(file) {
    const data = fs.readFileSync(file);
    return crypto.createHash("md5").update(data).digest("hex");
}

function scan(dir) {
    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) {
            scan(full);
        } else {
            const h = hashFile(full);
            hashes[h] = hashes[h] || [];
            hashes[h].push(full);
        }
    }
}

// тут можна вказати будь-яку директорію
scan("D:/other_useful_scripts_and_solutions");

for (const h in hashes) {
    if (hashes[h].length > 1) {
        console.log("Duplicates:", hashes[h]);
    }
}