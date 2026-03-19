import winreg

def get_installed_programs():
    programs = []
    reg_paths = [
        r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
        r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
    ]
    for reg_path in reg_paths:
        try:
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_path) as key:
                for i in range(0, winreg.QueryInfoKey(key)[0]):
                    subkey_name = winreg.EnumKey(key, i)
                    with winreg.OpenKey(key, subkey_name) as subkey:
                        try:
                            name = winreg.QueryValueEx(subkey, "DisplayName")[0]
                            programs.append(name)
                        except FileNotFoundError:
                            pass
        except FileNotFoundError:
            continue
    return programs

programs = get_installed_programs()
with open("./Python/All_programs_Win_11/installed_programs.txt", "w", encoding="utf-8") as f:
    for p in programs:
        f.write(p + "\n")

print("Список сохранён в installed_programs.txt")