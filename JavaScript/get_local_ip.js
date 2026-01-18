const os = require("os");

const interfaces = os.networkInterfaces();
for (const name in interfaces) {
    for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
            console.log(`${name}: ${iface.address}`);
        }
    }
}
