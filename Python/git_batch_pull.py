#!/usr/bin/env python3
import os, subprocess, argparse

def batch_pull(root):
    for dirpath, dirs, _ in os.walk(root):
        if ".git" in dirs:
            repo = dirpath
            print("Updating", repo)
            try:
                subprocess.check_call(["git", "-C", repo, "pull"])
            except subprocess.CalledProcessError as e:
                print("Failed:", repo, e)
            dirs[:] = []  # don't recurse into subdirs of a repo

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    args = p.parse_args()
    batch_pull(args.root)