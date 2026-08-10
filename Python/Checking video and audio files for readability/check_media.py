import os
import sys
import subprocess

VIDEO_EXT = {".mp4", ".avi", ".mov", ".mkv"}
AUDIO_EXT = {".mp3", ".wav", ".flac", ".ogg"}

def check_file(path, log_file, mode, log_mode):
    ext = os.path.splitext(path)[1].lower()
    if ext not in VIDEO_EXT and ext not in AUDIO_EXT:
        return

    try:
        if mode == "open":
            # Fast check using ffprobe (metadata only)
            cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                   "-of", "default=noprint_wrappers=1:nokey=1", path]
        else:  # full
            # Full decoding check using ffmpeg
            cmd = ["ffmpeg", "-v", "error", "-i", path, "-f", "null", "-"]

        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if result.returncode == 0 and (mode == "open" and result.stdout or mode == "full"):
            status = f"[OK] {path}"
        else:
            status = f"[FAIL] {path} — error: {result.stderr.decode(errors='ignore').strip()}"
    except Exception as e:
        status = f"[FAIL] {path} — exception: {e}"

    # Always print to console
    print(status)

    # Log depending on mode
    if log_mode == "all" or (log_mode == "errors" and status.startswith("[FAIL]")):
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(status + "\n")

def main(folder, depth, mode, log_mode, log_file):
    # Clear log file at start
    open(log_file, "w").close()

    try:
        for root, _, files in os.walk(folder):
            rel_path = os.path.relpath(root, folder)
            current_depth = 0 if rel_path == "." else rel_path.count(os.sep)
            if depth != "inf" and current_depth > int(depth):
                continue

            for f in files:
                check_file(os.path.join(root, f), log_file, mode, log_mode)
    except KeyboardInterrupt:
        print("\nStopped by Ctrl+C. Log saved.")
    finally:
        print(f"\nResults saved in {log_file}")

if __name__ == "__main__":
    if len(sys.argv) < 8:
        print("Usage: python check_media.py <folder> --depth <N|inf> --mode <open|full> --logmode <errors|all> --log <filename>")
    else:
        folder = sys.argv[1]
        depth = sys.argv[3]
        mode = sys.argv[5]
        log_mode = sys.argv[7]
        log_file = sys.argv[9] if len(sys.argv) > 9 else "check_log.txt"
        main(folder, depth, mode, log_mode, log_file)
