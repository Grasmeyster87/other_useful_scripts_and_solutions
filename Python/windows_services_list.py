import subprocess
import sys

# зробити stdout у UTF-8
sys.stdout.reconfigure(encoding="utf-8")

out = subprocess.check_output("sc query", shell=True)
print(out.decode("cp866", errors="ignore"))