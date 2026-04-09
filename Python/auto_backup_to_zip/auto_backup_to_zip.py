import os
import zipfile
from pathlib import Path
from datetime import datetime

def backup_folder(source_folder: str, target_folder: str):
    src_path = Path(source_folder).resolve()
    dest_path = Path(target_folder).resolve()
    
    dest_path.mkdir(parents=True, exist_ok=True)

    # Папки, в які ми НЕ заходимо
    ignore_dirs = {'.git', 'node_modules', '__pycache__', '.venv'}

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"{src_path.name}_backup_{timestamp}.zip"
    zip_file_path = dest_path / zip_name

    print(f"--- Backup start ---")
    print(f"Source: {src_path}")
    print(f"Target: {zip_file_path}")

    try:
        with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(src_path):
                # Ігноруємо цілі папки
                dirs[:] = [d for d in dirs if d not in ignore_dirs]
                
                for file in files:
                    file_path = Path(root) / file
                    
                    # Ігноруємо старі архіви та поточний архів, що створюється
                    if file_path.suffix.lower() == '.zip' or file_path == zip_file_path:
                        continue
                    
                    arcname = file_path.relative_to(src_path)
                    zipf.write(file_path, arcname)
        
        print(f"Success! Size: {zip_file_path.stat().st_size // 1024} KB")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # Викликаємо один раз для тесту (на рівень вище, зберегти тут)
    backup_folder("../", "./")