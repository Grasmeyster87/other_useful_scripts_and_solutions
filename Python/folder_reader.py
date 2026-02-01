#!/usr/bin/env python3
import os, json, argparse
import sys
sys.stdout.reconfigure(encoding='utf-8') # для настройки консоли

def scan(root):
    result = []
    for dirpath, dirs, files in os.walk(root):
        rel = os.path.relpath(dirpath, root)
        result.append({"path": rel, "dirs": dirs, "files": files})
    return result

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    if not os.path.exists(args.root):
        print(f"Path not found: {args.root}")
        sys.exit(1)

    data = scan(args.root)
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        for entry in data:
            print(f"{entry['path']}/ — {len(entry['dirs'])} dirs, {len(entry['files'])} files")