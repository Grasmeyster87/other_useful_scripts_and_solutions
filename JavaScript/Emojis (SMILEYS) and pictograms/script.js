const tbody = document.getElementById("ascii-table");
const loadingIndicator = document.getElementById("loading");

// Спеціальні назви для перших 32 символів
const controlNames = [
  "NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL",
  "BS","TAB","LF","VT","FF","CR","SO","SI",
  "DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB",
  "CAN","EM","SUB","ESC","FS","GS","RS","US"
];

// Ручний список популярних символів (сердечка, галочки, зірки, смайли)
const popularCodes = [
  10084, 10004, 10006, 9733, 9734, 128293, 128077, 128078, 
  128514, 128525, 128557, 129315, 128151, 128175, 9888, 
  9989, 11088, 127881, 128640, 128169, 128561, 128526, 
  129309, 128591, 128064, 128123, 128128, 9749, 127829, 
  127867, 9917, 127918, 128187, 128241, 128276, 128269,
  169, 174, 8482, 8364, 36, 8593, 8595, 8592, 8594
];

// Стан додатку
let appState = {
  mode: 'list', // 'range' або 'list'
  start: 0,
  end: 0,
  list: [],
  currentIndex: 0,
  step: 100 // Кількість символів за одне завантаження
};

// --- Ініціалізація ---
function init() {
  // Навішуємо події на кнопки категорій
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Активний клас
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const type = e.target.dataset.type;
      
      // Скидаємо таблицю
      tbody.innerHTML = "";
      appState.currentIndex = 0;
      appState.mode = type;

      if (type === 'range') {
        appState.start = parseInt(e.target.dataset.start);
        appState.end = parseInt(e.target.dataset.end);
      } else {
        // Якщо обрали "Популярні"
        appState.list = popularCodes;
      }

      loadNextBatch();
    });
  });

  // Завантажуємо популярні за замовчуванням
  appState.list = popularCodes;
  loadNextBatch();
}

// --- Головна функція рендеру ---
function loadNextBatch() {
  loadingIndicator.style.display = "block";
  let count = 0;
  let row;

  // Визначаємо ліміт для циклу
  // Якщо mode='range', працюємо з числами. Якщо 'list', працюємо з індексом масиву
  
  while (count < appState.step) {
    let code;
    
    if (appState.mode === 'range') {
      code = appState.start + appState.currentIndex;
      if (code > appState.end) break; // Кінець діапазону
    } else {
      if (appState.currentIndex >= appState.list.length) break; // Кінець списку
      code = appState.list[appState.currentIndex];
    }

    // Створюємо рядок, якщо це початок або кратне 4
    // (Але тут треба рахувати кількість вже доданих у поточну сесію + залишок)
    // Для спрощення: просто перевіряємо кількість дочірніх td в останньому tr
    let lastRow = tbody.lastElementChild;
    if (!lastRow || lastRow.children.length >= 8) { // 4 пари (код+символ) = 8 td
      row = document.createElement("tr");
      tbody.appendChild(row);
    } else {
      row = lastRow;
    }

    // Отримуємо символ
    let symbol = getSymbolFromCode(code);
    
    row.innerHTML += `<td>${code}</td><td>${symbol}</td>`;

    appState.currentIndex++;
    count++;
  }

  loadingIndicator.style.display = "none";
}

function getSymbolFromCode(code) {
  if (code < 32) return controlNames[code];
  if (code === 32) return "SPACE";
  if (code === 160) return "NBSP";
  
  try {
    return String.fromCodePoint(code);
  } catch (e) {
    return "";
  }
}

// --- Infinite Scroll ---
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    // Перевірка, чи ми не дійшли до кінця
    let isFinished = false;
    if (appState.mode === 'range' && (appState.start + appState.currentIndex > appState.end)) isFinished = true;
    if (appState.mode === 'list' && (appState.currentIndex >= appState.list.length)) isFinished = true;

    if (!isFinished) {
      loadNextBatch();
    }
  }
});

// --- Пошук (працює по вже завантажених елементах) ---
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const rows = tbody.getElementsByTagName("tr");

  for (let r of rows) {
    // Шукаємо в тексті рядка
    if (r.textContent.toLowerCase().includes(query)) {
      r.classList.add("highlight");
    } else {
      r.classList.remove("highlight");
    }
  }
});

// --- Копіювання ---
tbody.addEventListener("click", function (e) {
  if (e.target.tagName === "TD") {
    const text = e.target.textContent;
    // Якщо це просто число (код), копіюємо символ поруч. Якщо символ - копіюємо його.
    // Перевірка: чи складається текст тільки з цифр
    const isCode = /^\d+$/.test(text) || text.startsWith("U+");
    
    let textToCopy = text;
    if (isCode) {
        // Беремо наступний елемент (сам символ)
        textToCopy = e.target.nextElementSibling ? e.target.nextElementSibling.textContent : text;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
       // Візуальний ефект замість alert
       const originalBg = e.target.style.background;
       e.target.style.background = "#28a745"; // Зелений
       setTimeout(() => {
         e.target.style.background = originalBg;
       }, 200);
       console.log(`Скопійовано: ${textToCopy}`);
    });
  }
});

// Запуск
init();