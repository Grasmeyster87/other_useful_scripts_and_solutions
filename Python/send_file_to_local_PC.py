import subprocess

# копируем файл с локального ПК на другой
subprocess.run([
    "scp",
    "mydb.sqlite3",
    "user@192.168.1.50:/home/user/db_backups/"
])