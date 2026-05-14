import socket
from concurrent.futures import ThreadPoolExecutor

def scan_port(host, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.3)

            if s.connect_ex((host, port)) == 0:
                try:
                    service = socket.getservbyport(port)
                except:
                    service = "unknow"

                print(f"[OPEN] {port} ({service})")
    except:
        pass

host = "127.0.0.1"

with ThreadPoolExecutor(max_workers=200) as executor:
    for port in range(1, 60025):
        executor.submit(scan_port, host, port)