const { exec } = require("child_process");

const subnet = "192.168.1";
for (let i = 1; i <= 254; i++) {
    exec(`ping -n 1 -w 200 ${subnet}.${i}`, (err, stdout) => {
        if (stdout.includes("TTL=")) {
            console.log(`Active host: ${subnet}.${i}`);
        }
    });
}
