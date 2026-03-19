const { exec } = require("child_process");
const fs = require("fs");

const command = 'powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName"';

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Ошибка: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    fs.writeFileSync("./JavaScript/All_programs_Win_11/installed_programs.txt", stdout, "utf8");
    console.log("Список сохранён в installed_programs.txt");
});