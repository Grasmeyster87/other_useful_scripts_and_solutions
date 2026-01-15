import os

def list_directory_contents(directory_path, max_depth, current_depth=0, prefix=""):
    # Проверяем, не превышена ли максимальная глубина
    if current_depth > max_depth:
        return

    try:
        items = os.listdir(directory_path)
        for item in items:
            full_path = os.path.join(directory_path, item)

            # Исключаем определенные папки
            if os.path.isdir(full_path) and item in ["node_modules", ".git"]:
                continue

            # Аналогично можно включать только определенные папки:
            # if os.path.isdir(full_path) and item not in ["src", "public"]:
            #     continue

            if os.path.isdir(full_path):
                print(f"{prefix}📁 {item}/")
                # Рекурсивный вызов для подпапки
                list_directory_contents(full_path, max_depth, current_depth + 1, prefix + "  ")
            else:
                print(f"{prefix}📄 {item}")
    except Exception as e:
        print(f"Ошибка при доступе к {directory_path}: {e}")

# --- Использование скрипта ---

# 1. Укажите путь к корневому каталогу
root_directory = "./"   # <-- измените на ваш путь

# 2. Укажите максимальную глубину сканирования
# 0: только корневой каталог
# 1: корневой + его подпапки
# 2: корневой + подпапки + их подпапки
scan_depth = 2          # <-- измените при необходимости

print(f"Сканирование каталога: {root_directory} (Глубина: {scan_depth})\n")
list_directory_contents(root_directory, scan_depth)