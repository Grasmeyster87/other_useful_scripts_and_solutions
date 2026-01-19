const fs = require('fs');
const path = require('path');

// НАЛАШТУВАННЯ
const targetDir = './temp_downloads'; // Папка для очистки
const daysLimit = 30; // Файли, старіші за скільки днів видаляти
const dryRun = true; // true = Тільки показати, false = ВИДАЛИТИ РЕАЛЬНО

const msInDay = 24 * 60 * 60 * 1000;
const now = Date.now();
let deletedCount = 0;

if (!fs.existsSync(targetDir)) {
    console.log(`❌ Папка "${targetDir}" не існує.`);
    process.exit(1);
}

console.log(`🔍 Сканування папки: ${targetDir}`);
console.log(`📅 Пошук файлів старіших за ${daysLimit} днів...`);
if (dryRun) console.log('⚠️  РЕЖИМ ТЕСТУВАННЯ (файли не будуть видалені)\n');

fs.readdirSync(targetDir).forEach(file => {
    const filePath = path.join(targetDir, file);
    const stats = fs.statSync(filePath);

    // Розрахунок віку файлу
    const fileAgeDays = (now - stats.mtimeMs) / msInDay;

    if (fileAgeDays > daysLimit) {
        if (dryRun) {
            console.log(`🗑️  [TEST] Буде видалено: ${file} (Вік: ${fileAgeDays.toFixed(1)} дн.)`);
        } else {
            fs.unlinkSync(filePath);
            console.log(`🔥 Видалено: ${file}`);
        }
        deletedCount++;
    }
});

console.log(`\n🏁 Завершено. Знайдено/Видалено файлів: ${deletedCount}`);