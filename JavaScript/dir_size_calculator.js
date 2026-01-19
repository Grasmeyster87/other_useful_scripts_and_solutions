const fs = require('fs');
const path = require('path');

// Вхідна папка (за замовчуванням поточна)
const targetDir = process.argv[2] || '.';

// Функція для форматування байтів у KB, MB, GB
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Рекурсивна функція підрахунку
function getDirSize(directory) {
    let totalSize = 0;
    
    try {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                totalSize += getDirSize(filePath); // Рекурсія
            } else {
                totalSize += stats.size;
            }
        });
    } catch (err) {
        console.error(`⚠️ Не вдалося прочитати ${directory}: ${err.message}`);
    }

    return totalSize;
}

console.log(`⏳ Розрахунок розміру для: "${path.resolve(targetDir)}"...`);
const totalBytes = getDirSize(targetDir);
console.log(`📊 Загальний розмір: ${formatBytes(totalBytes)}`);