// system_monitor_logger.js
const os = require('os');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'system.log');
const INTERVAL = 5000; // 5 секунд

function getCPUUsage() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach(core => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  return {
    idle,
    total
  };
}

let lastCPU = getCPUUsage();

function getCPUPercent() {
  const current = getCPUUsage();

  const idleDiff = current.idle - lastCPU.idle;
  const totalDiff = current.total - lastCPU.total;

  lastCPU = current;

  return (1 - idleDiff / totalDiff) * 100;
}

function logSystemInfo() {
  const cpu = getCPUPercent().toFixed(2);
  const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
  const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
  const uptime = (os.uptime() / 60).toFixed(2);

  const log = `[${new Date().toISOString()}] CPU: ${cpu}% | RAM: ${freeMem}/${totalMem} MB | Uptime: ${uptime} min\n`;

  fs.appendFileSync(LOG_FILE, log);
  console.log(log.trim());
}

setInterval(logSystemInfo, INTERVAL);