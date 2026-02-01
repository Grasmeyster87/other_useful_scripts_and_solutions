#!/usr/bin/env python3
import os, argparse

def find(root, exts):
    for dirpath, _, files in os.walk(root):
        for f in files:
            if any(f.lower().endswith(ext) for ext in exts):
                print(os.path.join(dirpath, f))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    p.add_argument("--ext", "-e", nargs="+", required=True, help="Extensions like .py .txt")
    args = p.parse_args()
    find(args.root, [e.lower() for e in args.ext])