#include <windows.h>
#include <iostream>
#include <fstream>
#include <string>
#include <locale>
#include <codecvt>

void ListInstalledPrograms(const std::wstring& regPath, std::ofstream& outFile) {
    HKEY hKey;
    if (RegOpenKeyExW(HKEY_LOCAL_MACHINE, regPath.c_str(), 0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        DWORD index = 0;
        WCHAR subKeyName[256];
        DWORD subKeyLen;
        while (true) {
            subKeyLen = sizeof(subKeyName)/sizeof(WCHAR);
            if (RegEnumKeyExW(hKey, index++, subKeyName, &subKeyLen, NULL, NULL, NULL, NULL) != ERROR_SUCCESS)
                break;
            HKEY hSubKey;
            if (RegOpenKeyExW(hKey, subKeyName, 0, KEY_READ, &hSubKey) == ERROR_SUCCESS) {
                WCHAR displayName[256];
                DWORD size = sizeof(displayName);
                if (RegQueryValueExW(hSubKey, L"DisplayName", NULL, NULL, (LPBYTE)displayName, &size) == ERROR_SUCCESS) {
                    std::wstring_convert<std::codecvt_utf8<wchar_t>> conv;
                    outFile << conv.to_bytes(displayName) << std::endl;
                }
                RegCloseKey(hSubKey);
            }
        }
        RegCloseKey(hKey);
    }
}

int main() {
    std::ofstream outFile("installed_programs.txt");
    ListInstalledPrograms(L"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall", outFile);
    ListInstalledPrograms(L"SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall", outFile);
    outFile.close();
    std::cout << "Список сохранён в installed_programs.txt" << std::endl;
    return 0;
}