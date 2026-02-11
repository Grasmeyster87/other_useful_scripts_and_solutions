#!/usr/bin/env python3
import os, argparse
from collections import defaultdict

def folder_sizes(root):
    sizes = {}
    for dirpath, _, files in os.walk(root):
        total = 0
        for f in files:
            try:
                total += os.path.getsize(os.path.join(dirpath, f))
            except Exception:
                pass
        sizes[dirpath] = total
    return sizes

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    p.add_argument("--top", type=int, default=10)
    args = p.parse_args()
    s = folder_sizes(args.root)
    for path, size in sorted(s.items(), key=lambda x: x[1], reverse=True)[:args.top]:
        print(f"{size/1024/1024:.2f} MB\t{path}")