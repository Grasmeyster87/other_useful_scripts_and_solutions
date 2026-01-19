const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Коренева папка, де лежать ваші проекти
const rootDir = '.'; 

console.log('🚀 Починаю оновлення git-репозиторіїв...\n');

fs.readdir(rootDir, { withFileTypes: true }, (err, entries) => {
    if (err) return console.error('Помилка читання папки:', err);

    entries.forEach(entry => {
        // Перевіряємо, чи це папка
        if (entry.isDirectory()) {
            const repoPath = path.join(rootDir, entry.name);
            const gitFolder = path.join(repoPath, '.git');

            // Перевіряємо, чи є всередині папка .git
            if (fs.existsSync(gitFolder)) {
                console.log(`🔄 Оновлення: ${entry.name}...`);
                
                // Виконуємо команду системи
                exec('git pull', { cwd: repoPath }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Помилка в ${entry.name}: ${error.message}`);
                        return;
                    }
                    if (stderr && !stderr.includes('Already up to date')) {
                         // git іноді пише статус в stderr, це не завжди помилка
                         // console.log(`ℹ️ Git Info (${entry.name}): ${stderr}`);
                    }
                    console.log(`✅ ${entry.name}: \n${stdout.trim()}\n---`);
                });
            }
        }
    });
});