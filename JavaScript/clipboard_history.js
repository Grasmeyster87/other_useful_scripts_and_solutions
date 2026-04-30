/**
 * ============================================================
 *  Clipboard History — Історія буфера обміну
 * ============================================================
 *
 * Відстежує зміни в буфері обміну (clipboard) і зберігає
 * історію у файл із часовими мітками.
 *
 * Особливості:
 *  - Без зовнішніх залежностей (pure Node.js)
 *  - Працює на Windows (використовує PowerShell Get-Clipboard)
 *  - Ігнорує повторне копіювання одного й того ж тексту
 *  - Зберігає історію у clipboard_history.txt
 *  - Показує останні N записів при старті
 *  - Підтримує обмеження максимальної кількості записів
 *
 * Використання:
 *   node clipboard_history.js              — запуск з налаштуваннями за замовчуванням
 *   node clipboard_history.js --interval 500  — перевірка кожні 500 мс
 *   node clipboard_history.js --max 500       — зберігати макс. 500 записів
 *   node clipboard_history.js --file my.txt   — зберігати у вказаний файл
 *
 * Зупинка: Ctrl+C
 * ============================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Конфігурація ───────────────────────────────────────────

const CONFIG = {
    /** Інтервал перевірки буфера обміну (мс) */
    pollInterval: 1000,

    /** Файл для збереження історії */
    historyFile: path.join(__dirname, 'clipboard_history.txt'),

    /** Максимальна кількість записів (0 = без обмежень) */
    maxEntries: 1000,

    /** Кількість останніх записів для показу при старті */
    showLastN: 5,

    /** Максимальна довжина тексту для запису (символів, 0 = без обмежень) */
    maxTextLength: 5000,

    /** Роздільник між записами у файлі */
    separator: '─'.repeat(60),
};

// ─── Парсинг аргументів командного рядка ────────────────────

function parseArgs() {
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        switch (key) {
            case '--interval':
                CONFIG.pollInterval = parseInt(value, 10) || CONFIG.pollInterval;
                break;
            case '--max':
                CONFIG.maxEntries = parseInt(value, 10) || CONFIG.maxEntries;
                break;
            case '--file':
                CONFIG.historyFile = path.resolve(value);
                break;
            case '--show':
                CONFIG.showLastN = parseInt(value, 10) || CONFIG.showLastN;
                break;
            case '--help':
                printHelp();
                process.exit(0);
        }
    }
}

function printHelp() {
    console.log(`
╔══════════════════════════════════════════════════════╗
║          📋 Clipboard History — Довідка              ║
╠══════════════════════════════════════════════════════╣
║  --interval <мс>   Інтервал перевірки (за замовч. 1000)  ║
║  --max <число>     Макс. записів (за замовч. 1000)       ║
║  --file <шлях>     Файл для збереження історії           ║
║  --show <число>    Показати останніх N при старті         ║
║  --help            Ця довідка                            ║
╚══════════════════════════════════════════════════════╝
    `);
}

// ─── Робота з буфером обміну (Windows) ──────────────────────

/**
 * Зчитує поточний вміст буфера обміну через PowerShell.
 * @returns {string|null} Текст із буфера або null при помилці
 */
function getClipboardContent() {
    try {
        const result = execSync(
            'powershell -NoProfile -Command "Get-Clipboard"',
            {
                encoding: 'utf-8',
                timeout: 3000,
                stdio: ['pipe', 'pipe', 'pipe'],
            }
        );
        return result.trim();
    } catch {
        return null;
    }
}

// ─── Робота з файлом історії ────────────────────────────────

/**
 * Форматує запис для збереження у файл.
 * @param {string} text - Скопійований текст
 * @param {number} index - Порядковий номер запису
 * @returns {string} Форматований рядок
 */
function formatEntry(text, index) {
    const now = new Date();
    const timestamp = now.toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const truncated =
        CONFIG.maxTextLength > 0 && text.length > CONFIG.maxTextLength
            ? text.substring(0, CONFIG.maxTextLength) + '\n... [обрізано]'
            : text;

    const charCount = text.length;
    const lineCount = text.split('\n').length;

    return [
        CONFIG.separator,
        `📌 #${index} | 🕐 ${timestamp} | ${charCount} симв. | ${lineCount} рядк.`,
        CONFIG.separator,
        truncated,
        '',
    ].join('\n');
}

/**
 * Додає запис до файлу історії.
 * @param {string} entry - Форматований запис
 */
function appendToHistory(entry) {
    fs.appendFileSync(CONFIG.historyFile, entry + '\n', 'utf-8');
}

/**
 * Підраховує кількість записів у файлі.
 * @returns {number}
 */
function countEntries() {
    if (!fs.existsSync(CONFIG.historyFile)) return 0;
    const content = fs.readFileSync(CONFIG.historyFile, 'utf-8');
    const matches = content.match(/📌 #\d+/g);
    return matches ? matches.length : 0;
}

/**
 * Обрізає файл до максимальної кількості записів.
 */
function trimHistory() {
    if (CONFIG.maxEntries <= 0) return;

    const content = fs.readFileSync(CONFIG.historyFile, 'utf-8');
    const entries = content.split(CONFIG.separator).filter((e) => e.trim());

    if (entries.length <= CONFIG.maxEntries) return;

    // Залишаємо тільки останні maxEntries записів
    const trimmed = entries.slice(-CONFIG.maxEntries);
    fs.writeFileSync(CONFIG.historyFile, trimmed.join(CONFIG.separator), 'utf-8');
    console.log(`\n🗑️  Історію обрізано до ${CONFIG.maxEntries} записів`);
}

/**
 * Показує останні N записів з файлу.
 */
function showRecentEntries() {
    if (!fs.existsSync(CONFIG.historyFile)) {
        console.log('\n📭 Файл історії порожній. Починаємо записувати...\n');
        return;
    }

    const content = fs.readFileSync(CONFIG.historyFile, 'utf-8');
    const blocks = content.split(CONFIG.separator).filter((e) => e.trim());

    if (blocks.length === 0) {
        console.log('\n📭 Історія порожня. Починаємо записувати...\n');
        return;
    }

    const recent = blocks.slice(-CONFIG.showLastN * 2); // *2 бо кожен запис = мета + текст
    console.log(`\n📜 Останні записи з історії:`);
    console.log(CONFIG.separator);
    console.log(recent.join(CONFIG.separator));
    console.log('');
}

// ─── Основний моніторинг ────────────────────────────────────

function startMonitoring() {
    let lastContent = getClipboardContent();
    let entryCount = countEntries();
    let checkCount = 0;

    console.log(`
╔══════════════════════════════════════════════════════════╗
║        📋  Clipboard History — Моніторинг запущено       ║
╠══════════════════════════════════════════════════════════╣
║  Інтервал:       ${String(CONFIG.pollInterval).padEnd(6)} мс                          ║
║  Файл:           ${path.basename(CONFIG.historyFile).padEnd(38)}║
║  Макс. записів:  ${String(CONFIG.maxEntries || '∞').padEnd(6)}                              ║
║  Записів у файлі: ${String(entryCount).padEnd(5)}                              ║
╠══════════════════════════════════════════════════════════╣
║  Копіюйте текст — він автоматично зберігається!          ║
║  Натисніть Ctrl+C для зупинки                            ║
╚══════════════════════════════════════════════════════════╝`);

    showRecentEntries();

    // Зберігаємо поточний вміст буфера при старті (якщо він не порожній)
    if (lastContent && lastContent !== '') {
        entryCount++;
        const entry = formatEntry(lastContent, entryCount);
        appendToHistory(entry);

        const preview =
            lastContent.length > 80
                ? lastContent.substring(0, 80).replace(/\n/g, '↵') + '...'
                : lastContent.replace(/\n/g, '↵');

        console.log(`📥 #${entryCount} | ${new Date().toLocaleTimeString('uk-UA')} | [вже в буфері] ${preview}`);
    }

    const intervalId = setInterval(() => {
        checkCount++;
        const currentContent = getClipboardContent();

        // Пропускаємо якщо буфер порожній або не змінився
        if (currentContent === null || currentContent === '') return;
        if (currentContent === lastContent) return;

        lastContent = currentContent;
        entryCount++;

        const entry = formatEntry(currentContent, entryCount);
        appendToHistory(entry);

        // Попередній перегляд у консолі
        const preview =
            currentContent.length > 80
                ? currentContent.substring(0, 80).replace(/\n/g, '↵') + '...'
                : currentContent.replace(/\n/g, '↵');

        console.log(`✅ #${entryCount} | ${new Date().toLocaleTimeString('uk-UA')} | ${preview}`);

        // Перевіряємо обмеження кожні 50 записів
        if (CONFIG.maxEntries > 0 && entryCount % 50 === 0) {
            trimHistory();
        }
    }, CONFIG.pollInterval);

    // Коректне завершення при Ctrl+C
    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log(`\n\n${'═'.repeat(58)}`);
        console.log(`📊 Сесія завершена`);
        console.log(`   Перевірок: ${checkCount}`);
        console.log(`   Збережено записів: ${entryCount}`);
        console.log(`   Файл: ${CONFIG.historyFile}`);
        console.log(`${'═'.repeat(58)}\n`);
        process.exit(0);
    });
}

// ─── Запуск ─────────────────────────────────────────────────

parseArgs();

// Перевірка ОС
if (process.platform !== 'win32') {
    console.error('❌ Цей скрипт працює тільки на Windows (використовує PowerShell Get-Clipboard)');
    process.exit(1);
}

// Перевірка доступності PowerShell
try {
    execSync('powershell -NoProfile -Command "echo ok"', { stdio: 'pipe' });
} catch {
    console.error('❌ PowerShell недоступний. Переконайтеся, що PowerShell встановлено.');
    process.exit(1);
}

// Створюємо файл якщо не існує
if (!fs.existsSync(CONFIG.historyFile)) {
    const header = [
        '╔══════════════════════════════════════════════════════╗',
        '║          📋 Clipboard History — Журнал               ║',
        '║          Створено: ' + new Date().toLocaleString('uk-UA').padEnd(33) + '║',
        '╚══════════════════════════════════════════════════════╝',
        '',
    ].join('\n');
    fs.writeFileSync(CONFIG.historyFile, header, 'utf-8');
}

startMonitoring();
