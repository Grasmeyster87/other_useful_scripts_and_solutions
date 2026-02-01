const tbody = document.getElementById("ascii-table");

// Названия управляющих символов (0–31)
const controlNames = [
  "NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL",
  "BS","TAB","LF","VT","FF","CR","SO","SI",
  "DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB",
  "CAN","EM","SUB","ESC","FS","GS","RS","US"
];

let row;
for (let i = 0; i < 256; i++) {
  if (i % 4 === 0) {
    row = document.createElement("tr");
    tbody.appendChild(row);
  }

  let symbol;
if (i === 32) {
  symbol = "SPACE";
} else if (i === 160) {
  symbol = "NBSP";
} else if (i < 32) {
  symbol = controlNames[i];
} else {
  symbol = String.fromCharCode(i);
}


  row.innerHTML += `<td>${i}</td><td>${symbol}</td>`;
}

// Поиск по таблице
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const rows = tbody.getElementsByTagName("tr");

  for (let r of rows) {
    let text = r.textContent.toLowerCase();
    if (text.includes(query)) {
      r.classList.add("highlight");
    } else {
      r.classList.remove("highlight");
    }
  }
});

// Копирование символа при клике
tbody.addEventListener("click", function (e) {
  if (e.target.tagName === "TD") {
    const text = e.target.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert(`Скопировано: ${text}`);
    });
  }
});