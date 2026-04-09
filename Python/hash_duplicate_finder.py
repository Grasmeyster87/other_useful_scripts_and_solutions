import os
import hashlib
from pathlib import Path

def get_file_hash(file_path):
    """Створює MD5 хеш файлу."""
    hasher = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            # Читаємо частинами, щоб не забивати оперативну пам'ять
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except:
        return None

def find_duplicates(target_dir):
    hashes = {} # {hash: [list_of_paths]}
    duplicates = []
    
    print(f"Сканую: {target_dir}...\n")
    
    for root, _, files in os.walk(target_dir):
        for file in files:
            path = Path(root) / file
            file_hash = get_file_hash(path)
            
            if file_hash:
                if file_hash in hashes:
                    hashes[file_hash].append(str(path))
                    duplicates.append(str(path))
                else:
                    hashes[file_hash] = [str(path)]
    
    if duplicates:
        print(f"Знайдено дублікатів: {len(duplicates)}")
        for h, paths in hashes.items():
            if len(paths) > 1:
                print(f"\nОригінал: {paths[0]}")
                for dup in paths[1:]:
                    print(f"  > Копія: {dup}")
    else:
        print("Дублікатів не знайдено.")

#if __name__ == "__main__":
#    folder = input("Введіть шлях для перевірки на дублікати: ").strip() or "."
#    find_duplicates(folder)

if __name__ == "__main__":
    #folder = input("Введіть шлях для перевірки на дублікати: ").strip() or "."
    find_duplicates("../")