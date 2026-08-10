# other_useful_scripts_and_solutions

---

## JavaScript

**folder_reader.js** — створення списку папок та файлів у кореневій папці.

**file_watcher.js** — відслідковує зміни у файлах і автоматично виконує дію (наприклад, перезапуск сервера).

**recursive_file_search.js** — рекурсивний пошук файлів за розширенням.

**scan_local_network.js** — сканування локальної мережі (ping sweep). Визначає активні хости в підмережі.

**get_local_ip.js** — отримання локальної IP-адреси.

**duplicate_files_finder.js** — пошук дублікатів файлів.

**bulk_renamer.js** — масове перейменування. Замінює пробіли у назвах файлів на підкреслення `_` і переводить назву у нижній регістр. Класична задача для впорядкування файлів.

**old_files_cleaner.js** — очистка старих файлів. Увага: скрипт видаляє файли! Додано змінну `dryRun`, яка за замовчуванням `true` — скрипт спочатку тільки покаже, що він збирається видалити. Щоб видалити реально, змініть її на `false`.

**dir_size_calculator.js** — рекурсивний розмір папки. Рахує розмір папки разом з усіма вкладеними підпапками.

**git_batch_pull.js** — масове оновлення git-репозиторіїв. Проходить по всіх папках у поточній директорії, знаходить `.git` всередині і виконує `git pull`.

**tableASCII** — вивід на сторінку браузера символів таблиці ASCII, Emojis (SMILEYS) та піктограм.

**All_programs_Win_11.js** — список всіх встановлених програм. Зберігається у txt-файл.

**system_monitor_logger.js** — моніторинг системи та логування: CPU, RAM, uptime із записом у файл.

**clipboard_history.js** —  clipboard history. Tracks changes to the clipboard and saves the history to a file with timestamps. No external dependencies, runs on Windows via PowerShell. Supports write limits, interval settings, and preview in the console.
історія буфера обміну. Відстежує зміни в clipboard і зберігає історію у файл із часовими мітками. Без зовнішніх залежностей, працює на Windows через PowerShell. Підтримує обмеження записів, налаштування інтервалу та попередній перегляд у консолі.

**merge-files.js** - merging project files into one
**get-all-commits.js** - getting git commits from all branches.
---

## Python

**reading a list of directories and folders.py** — створення списку папок та файлів у кореневій папці.

**send_file_to_local_PC.py** — передача файлу з комп'ютера на комп'ютер через SSH та бібліотеку `paramiko`.

**windows_services_list.py** — виводить список усіх служб Windows, які зареєстровані в системі.

**recursive_file_search.py** — пошук файлів за розширенням.

**git_batch_pull.py** — масове оновлення git-репозиторіїв. Проходить підпапки, знаходить `.git` і виконує `git pull`.

**All_programs_Win_11.py** — список всіх встановлених програм. Зберігається у txt-файл.

**dir_size_calculator.py** — рекурсивний розрахунок розміру папки. Підраховує загальний розмір директорії і виводить топ N за розміром.

**auto_backup_to_zip.py** — розумне створення резервних копій. Пакує вказані робочі папки у ZIP-архів із міткою часу. Головна фішка — вміє ігнорувати «важкі» директорії (наприклад, `node_modules`, `.git`, `__pycache__`, `venv`), щоб бекап створювався миттєво і займав мінімум місця.

**hash_duplicate_finder.py** — глибокий пошук дублікатів за вмістом. Порівнює файли не за назвою, а за їхнім «відбитком» (MD5 хеш). Це дозволяє знайти абсолютно однакові фото чи документи, навіть якщо вони перейменовані.

**downloaderFile.py** — File downloads with the ability to resume downloads, a progress bar showing downloads/total, and download speed in KB
закачування файлів з можливістю докачування прогрес баром завантажено/всього і швидкістю скачування в кБ

**port_scanner.py** - TCP port scanner. Checks for open ports on a local or remote host. Supports scanning a single port, a list of ports, or an entire range. Useful for checking local services, servers, Docker containers, databases, and network diagnostics.                                                                                                                                                                        TCP port scanner. Перевіряє відкриті порти на локальному або віддаленому хості. Підтримує сканування одного порту, списку портів або цілого діапазону. Корисний для перевірки локальних сервісів, серверів, Docker-контейнерів, баз даних та мережевої діагностики.

**check_media.py** - Checking media files in the specified directory for readability  
Перевірка медіафайлів в указаній директорії на можливість читання  

## 📂 Folder traversal depth / Глибина обходу папок
- `--depth N` → check only up to the specified nesting level  
- `--depth inf` → infinite depth (default, scans all subfolders)  
- `--depth 0` → only the specified folder itself  

---

## 🎬 File checking modes / Режими перевірки файлів
- `--mode open` → fast check using **ffprobe** (only opening and metadata)  
- `--mode full` → full run using **ffmpeg** (decoding the entire file)  

---

## 📝 Log modes / Режими логування
- `--logmode errors` → save only problematic files to log  
- `--logmode all` → save the full list of checked files with results  

---

## ⚡ Examples / Приклади

### 1. Check all nested folders, fast mode, log only errors  
```bash
python check_media.py D:\Music --depth inf --mode open --logmode errors
```

### 2. Check only current folder and one level of subfolders, full run, log all files  
```bash
python check_media.py D:\Music --depth 1 --mode full --logmode all
```

---

## ✅ Requirements / Вимоги
- Python 3.10+  
- Installed **ffmpeg** and **ffprobe** (must be available in PATH)  

---

## C++

**All_programs_Win_11.cpp** — список всіх встановлених програм. Зберігається у txt-файл.