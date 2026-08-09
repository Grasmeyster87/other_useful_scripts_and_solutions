import os
import sys
import subprocess

VIDEO_EXT = {".mp4", ".avi", ".mov", ".mkv"}
AUDIO_EXT = {".mp3", ".wav", ".flac", ".ogg"}

def check_file(path, log_file):
    ext = os.path.splitext(path)[1].lower()
    if ext not in VIDEO_EXT and ext not in AUDIO_EXT:
        return

    try:
        # ffmpeg проверка: просто пробуем открыть файл
        cmd = ["ffmpeg", "-v", "error", "-i", path, "-f", "null", "-"]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if result.returncode == 0:
            status = f"[OK] {path}"
        else:
            status = f"[FAIL] {path} — ошибка: {result.stderr.decode(errors='ignore').strip()}"

    except Exception as e:
        status = f"[FAIL] {path} — исключение: {e}"

    print(status)
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(status + "\n")

def main(folder):
    log_file = "check_log.txt"
    open(log_file, "w").close()  # очистка лога
    for root, _, files in os.walk(folder):
        for f in files:
            check_file(os.path.join(root, f), log_file)
    print(f"\nРезультаты сохранены в {log_file}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Использование: python check_media_ffmpeg.py <папка>")
    else:
        main(sys.argv[1])
