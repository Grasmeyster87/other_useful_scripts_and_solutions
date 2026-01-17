import paramiko
import os

def upload_file():
    host = "192.168.1.60"
    user = "Azal"
    password = "1987" # Введіть пароль від Win 10
    
    local_path = r"D:\Video_link.db"
    remote_path = r"D:\dowloads\Video_link.db"

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=user, password=password)
        
        sftp = ssh.open_sftp()
        sftp.put(local_path, remote_path)
        sftp.close()
        ssh.close()
        print("Файл успішно передано через пароль!")
    except Exception as e:
        print(f"Помилка: {e}")

upload_file()