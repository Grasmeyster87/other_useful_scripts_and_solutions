const fs = require('fs');
const path = require('path');

// НАЛАШТУВАННЯ: Шлях до папки (крапка - це поточна папка)
const targetDir = './';

try {
    // Читаємо вміст
    const files = fs.readdirSync(targetDir);

    files.forEach(file => {
        const oldPath = path.join(targetDir, file);

        // Пропускаємо, якщо це папка, а не файл
        if (fs.lstatSync(oldPath).isDirectory()) return;

        // ЛОГІКА ПЕРЕЙМЕНУВАННЯ:
        // 1. Змінюємо пробіли на підкреслення
        // 2. Робимо всі букви маленькими
        const newFilename = file.replace(/\s+/g, '_').toLowerCase();

        // Якщо ім'я не змінилось - пропускаємо
        if (file === newFilename) return;

        const newPath = path.join(targetDir, newFilename);

        // Перейменовуємо
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Перейменовано: "${file}" -> "${newFilename}"`);
    })
    console.log('🏁 Роботу завершено.');
}catch (err) {
    console.error('❌ Помилка:', err.message);
}