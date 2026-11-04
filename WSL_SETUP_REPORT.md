# WSL2 Ubuntu Testing Environment Setup Report

**Generated on:** 2026-11-04  
**Workspace:** `~/blinkit-testing/`  
**Host Environment:** Windows with WSL2 (Ubuntu 24.04.4 LTS)  

---

## 1. Environment & Dependency Summary

| Component | Detected Version / Path | Status Label | Notes |
|---|---|---|---|
| **WSL Ubuntu Version** | Ubuntu 24.04.4 LTS (`6.6.87.2-microsoft-standard-WSL2`) | **INSTALLED AND VERIFIED** | Running WSL2 with 949 GB disk available. |
| **Node.js** | `v24.17.0` (`/usr/bin/node`) | **INSTALLED AND VERIFIED** | Pre-existing Node.js installation preserved. |
| **npm** | `11.13.0` (`/usr/bin/npm`) | **INSTALLED AND VERIFIED** | Pre-existing npm installation preserved. |
| **Python** | `Python 3.12.3` (`/usr/bin/python3`) | **INSTALLED AND VERIFIED** | System Python 3. |
| **Java (JDK)** | OpenJDK `17.0.20.1` (`/usr/lib/jvm/java-17-openjdk-amd64`) | **INSTALLED AND VERIFIED** | OpenJDK 17 configured with `JAVA_HOME`. |
| **Playwright** | `1.64.1` (`@playwright/test`) | **INSTALLED AND VERIFIED** | Configured in both `web/` and `~/blinkit-testing/playwright/`. |
| **Chromium** | Chrome for Testing `156.0.8078.4` (v1248) | **INSTALLED AND VERIFIED** | Installed in `~/.cache/ms-playwright/`. Runs headless in WSL2. |
| **Maestro CLI** | `2.12.1` (`/usr/local/bin/maestro`) | **INSTALLED AND VERIFIED** | Official Linux installer executed; symlinked to `/usr/local/bin`. |
| **Android SDK** | Not installed on Windows or WSL | **NOT INSTALLED** | Required only for native Android emulator builds. |
| **ADB (Android Debug Bridge)** | `1:34.0.4-1build3` (`/usr/bin/adb`) | **INSTALLED AND VERIFIED** | Installed in WSL. Daemon starts at `tcp:5037`. |
| **Connected Device / Emulator** | None currently attached | **REQUIRES MANUAL CONFIGURATION** | No physical device or running emulator detected. |

---

## 2. Playwright Verification Results

- **Configuration:** Initialized in both `/mnt/e/Humbingo/Blinkit/web` and `~/blinkit-testing/playwright`.
- **Browser:** Chromium (headless).
- **Test File 1:** `/mnt/e/Humbingo/Blinkit/web/tests/local-verification.spec.js`  
  - Result: **1 passed (2.9s)** (Code: 0)
- **Test File 2:** `~/blinkit-testing/playwright/tests/browser-test.spec.js`  
  - Result: **1 passed (1.4s)** (Code: 0)
- **Capabilities Verified:**
  1. Chromium headless browser launch in WSL2.
  2. Local DOM element rendering and title assertion (`Blinkit WSL Verification`).
  3. Interactive DOM manipulation and assertions (`#btn` click updates `#status`).
  4. Clean browser fixture teardown.

---

## 3. Maestro Verification Results

- **Configuration:** CLI binary installed at `~/.maestro/bin/maestro` and globally accessible via `/usr/local/bin/maestro`.
- **Java Runtime:** OpenJDK 17 verified via `$JAVA_HOME/bin/java`.
- **CLI Commands Executed & Verified:**
  - `maestro --version` -> `2.12.1`
  - `maestro --help` -> Help documentation rendered successfully.
  - `maestro list-devices` -> Successfully queries platforms and detects `chromium default`.
- **Device UI Automation Status:** **REQUIRES MANUAL CONFIGURATION**  
  Device UI testing requires a running Android emulator or physical device connected via USB debugging.

---

## 4. Testing Workspace Organization

```text
~/blinkit-testing/
├── playwright/
│   ├── package.json
│   ├── playwright.config.js
│   ├── tests/
│   │   └── browser-test.spec.js
│   └── README.md
├── maestro/
│   ├── flows/
│   │   └── verification-flow.yaml
│   └── README.md
└── setup-report.md
```

---

## 5. Errors & Configuration Notes

1. **Non-Interactive Shell PATH:** Ubuntu's default `~/.bashrc` exits early for non-interactive commands (`case $- in *i*) ;; *) return;; esac`). To ensure tools like `maestro` and `java` are available in both interactive and automated/headless invocations, `/etc/profile.d/maestro.sh` was created and `/usr/local/bin/maestro` symlink was established.
2. **Missing Windows Android SDK:** Windows host does not have Android Studio or the Android SDK command line tools installed. Running an Android emulator requires installing Android Studio on Windows.

---

## 6. Steps to Connect Windows Android Emulator to WSL2

When you are ready to test the React Native mobile application on an Android emulator:

1. **Install Android Studio on Windows:**
   - Download from [developer.android.com/studio](https://developer.android.com/studio).
   - In SDK Manager, install **Android SDK Platform-Tools** and an **Android System Image**.
2. **Create and Launch an AVD:**
   - Open Android Studio -> **Device Manager** -> **Create Device** (e.g., Pixel 7, API 34).
   - Click **Run** to launch the emulator.
3. **Expose Windows ADB to WSL2:**
   - In PowerShell on Windows:
     ```powershell
     adb kill-server
     adb -a nodaemon server start
     ```
4. **Link WSL2 ADB to Windows:**
   - In WSL2 terminal:
     ```bash
     export ADB_SERVER_SOCKET=tcp:$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):5037
     adb devices
     ```
   - Verify the emulator is listed with `device` status.
5. **Run Maestro Flow:**
   ```bash
   cd ~/blinkit-testing/maestro
   maestro test flows/verification-flow.yaml
   ```
