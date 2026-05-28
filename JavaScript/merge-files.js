// merge-files.js
const fs = require('fs').promises;
const path = require('path');

const DEFAULT_FILES = [
    './e-commerce-scraper-ebay/backend/src/server.js',
    './e-commerce-scraper-ebay/backend/src/scraperService.js',
];
const DEFAULT_OUTPUT_NAME = 'All.files';

/**
 * Повертає заголовок у форматі:
 * \n\n// ======================================================= <відносний шлях>\n\n
 * (дві пусті строки перед і дві після)
 */
function makeHeader(fullPath) {
  const rel = path.relative(process.cwd(), fullPath) || fullPath;
  return `\n\n// ======================================================= ${rel}\n\n`;
}

/**
 * Знаходить найменший спільний батьківський каталог (не використовується для запису за замовчуванням,
 * але лишається на випадок потреби)
 */
function findCommonParent(paths) {
  const parts = paths.map(p => path.resolve(p).split(path.sep));
  const minLen = Math.min(...parts.map(p => p.length));
  let i = 0;
  for (; i < minLen; i++) {
    const seg = parts[0][i];
    if (!parts.every(p => p[i] === seg)) break;
  }
  const common = parts[0].slice(0, i).join(path.sep) || path.sep;
  return common;
}

/**
 * Основна функція злиття
 * filePaths - масив шляхів до файлів
 * outputDir - директорія куди записати All.files (за замовчуванням __dirname)
 * outputName - ім'я вихідного файлу
 */
async function mergeFiles(filePaths, outputDir = __dirname, outputName = DEFAULT_OUTPUT_NAME) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error('Потрібен масив шляхів до файлів.');
  }

  const resolved = filePaths.map(p => path.resolve(p));
  const outputPath = path.join(outputDir, outputName);

  const parts = [];

  for (const p of resolved) {
    try {
      const stat = await fs.stat(p);
      if (!stat.isFile()) {
        console.warn(`Пропускаю не-файл: ${p}`);
        continue;
      }

      let content = await fs.readFile(p, 'utf8');
      // Уніфікуємо кінці рядків
      content = content.replace(/\r\n/g, '\n');

      // Видаляємо максимум один початковий порожній рядок у вмісті,
      // щоб не "з'їдати" дві пусті строки після заголовка.
      // Якщо файл має багато початкових пустих рядків — вони будуть збережені як один.
      content = content.replace(/^\n+/, '\n');

      // Формуємо заголовок (відносний шлях для читабельності)
      const header = makeHeader(p);

      // Додаємо header + content
      // Гарантуємо, що після header буде саме дві пусті строки, а потім вміст файлу
      // (header вже закінчується на '\n\n', тому просто приєднуємо content без додаткових трюків)
      parts.push(header + content);
    } catch (err) {
      console.warn(`Не вдалося прочитати ${p}: ${err.message}`);
    }
  }

  const final = parts.join('\n');

  if (final.trim().length === 0) {
    throw new Error('Немає вмісту для запису.');
  }

  await fs.writeFile(outputPath, final, 'utf8');
  return outputPath;
}

/**
 * Парсинг CLI:
 * node merge-files.js [--outdir ./some/dir] file1 file2 ...
 * Якщо файли не передані — використовуються DEFAULT_FILES.
 */
(async () => {
  try {
    const argv = process.argv.slice(2);
    let outdir = __dirname;
    const files = [];

    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a === '--outdir' || a === '-o') {
        const next = argv[i + 1];
        if (!next) {
          throw new Error('Після --outdir потрібно вказати шлях до директорії.');
        }
        outdir = path.resolve(next);
        i++;
      } else {
        files.push(a);
      }
    }

    const fileList = files.length > 0 ? files : DEFAULT_FILES;

    // Переконаємось, що директорія для запису існує
    await fs.mkdir(outdir, { recursive: true });

    const out = await mergeFiles(fileList, outdir, DEFAULT_OUTPUT_NAME);
    console.log('Злиття завершено. Файл створено:', out);
  } catch (err) {
    console.error('Помилка:', err.message);
    process.exit(1);
  }
})();
