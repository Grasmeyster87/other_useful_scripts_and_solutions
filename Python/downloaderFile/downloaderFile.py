import requests
import os
import time

def download_file(url, filepath):
    # Проверяем, есть ли уже частично скачанный файл
    downloaded_bytes = 0
    if os.path.exists(filepath):
        downloaded_bytes = os.path.getsize(filepath)

    headers = {}
    if downloaded_bytes > 0:
        headers['Range'] = f'bytes={downloaded_bytes}-'

    with requests.get(url, headers=headers, stream=True) as r:
        r.raise_for_status()
        total_size = int(r.headers.get('Content-Length', 0)) + downloaded_bytes
        mode = "ab" if downloaded_bytes > 0 else "wb"

        start_time = time.time()
        with open(filepath, mode) as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded_bytes += len(chunk)

                    # вычисляем прогресс
                    elapsed = time.time() - start_time
                    speed = downloaded_bytes / 1024 / elapsed if elapsed > 0 else 0
                    percent = downloaded_bytes / total_size * 100 if total_size > 0 else 0

                    print(f"\rСкачано: {downloaded_bytes/1024/1024:.2f} MB "
                          f"из {total_size/1024/1024:.2f} MB "
                          f"({percent:.2f}%) | Скорость: {speed:.2f} KB/s", end="")

    print("\nЗагрузка завершена:", filepath)

# Пример использования
url = "https://releases.ubuntu.com/26.04/ubuntu-26.04-desktop-amd64.iso"
filepath = r"D:\ubuntu-26.04-desktop-amd64.iso"
download_file(url, filepath)
