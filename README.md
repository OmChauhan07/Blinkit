# Blinkit - Separated Web & Mobile Projects

This repository contains two fully separated, independent applications modeling the authentic Blinkit quick-commerce service:

1. **`web/`**: Responsive web application built with **React 19**, **Vite**, and **Tailwind CSS**.
2. **`mobile/`**: Cross-platform mobile application built with **React Native 0.88**, **React 19**, and **Expo SDK 58** (supporting Android, iOS, and Web preview).

---

## Directory Structure

```
Blinkit/
├── web/                       # Standalone Web Application
│   ├── src/                   # React components, pages, state & views
│   ├── public/                # Static public assets
│   ├── index.html             # HTML entrypoint
│   ├── vite.config.ts         # Vite bundler configuration
│   ├── tsconfig.json          # Web TypeScript configuration
│   ├── .npmrc                 # Local npm policy config
│   └── package.json           # Web scripts and dependencies
│
├── mobile/                    # Standalone Mobile Application
│   ├── src/                   # React Native screens, components & context
│   ├── App.tsx                # App root with Native Stack & Bottom Tabs
│   ├── app.json               # Expo SDK 58 configuration
│   ├── tsconfig.json          # Mobile TypeScript configuration
│   ├── .npmrc                 # Local npm policy config
│   └── package.json           # Mobile scripts and dependencies
│
├── package.json               # Workspace root scripts (convenience wrappers)
├── .npmrc                     # Workspace npm configuration
└── README.md
```

---

## Frontend Tests & Health Checks

You can run automated tests and typechecks across both projects from the root or individually:

| Test Command | Scope | Description |
|---|---|---|
| `npm test` | Root (All) | Runs both web and mobile frontend tests (`tsc --noEmit`) |
| `npm run test:web` | Web (`web/`) | TypeScript typecheck and linting on all web views & components |
| `npm run test:mobile` | Mobile (`mobile/`) | TypeScript typecheck on all React Native screens & components |
| `npm run build:web` | Web (`web/`) | Production build via Vite |
| `npm --prefix mobile run doctor` | Mobile (`mobile/`) | Runs Expo Doctor (20/20 checks passed) |

---

## Responsive Layout Architecture

Both the **Web** and **Mobile** applications are designed and tested to be responsive across all screen dimensions:

- **Mobile Phones (320px – 430px)**:
  - **Web**: Auto-collapsing navigation, mobile location and quick ETA strip, full-width sliding cart drawer, single-column forms, fluid product grids (2 items per row).
  - **Mobile**: Edge-to-edge fluid layouts, 2-column flex cards (`minWidth: 140px, maxWidth: 220px`), floating quick-action cart bar with proper padding, native bottom tab navigation.
- **Tablets & Large Foldables (600px – 1024px)**:
  - **Web**: 3 to 4 column product grids, responsive header search with autocomplete, balanced checkout layout.
  - **Mobile**: Centered content containers (`maxWidth: 700px – 960px`) preventing awkward edge-to-edge stretching, 3 to 4 column wrapped product shelves, centered bottom sheets and floating bars.
- **Laptops & Desktops (1200px+)**:
  - **Web**: Full 6-column product shelves, split 7:5 checkout columns, fixed sticky category sidebar rail, max-width 1280px container.
  - **Mobile (Web View)**: Clean centered mobile / tablet experience without distorted aspect ratios.

---

## How to Run

### Option A: Running from Root Directory

| Action | Command | URL / Notes |
|---|---|---|
| **Run Web Dev Server** | `npm run dev:web` | [http://localhost:3000](http://localhost:3000) |
| **Run Mobile on Web** | `npm run dev:mobile:web` | [http://localhost:8081](http://localhost:8081) |
| **Run Mobile with Cloud Tunnel** | `npm run dev:mobile:tunnel` | **Recommended**: Direct connection from phone via Expo Go |
| **Run Mobile with Metro (LAN)** | `npm run dev:mobile` | Scannable QR code for Expo Go on local Wi-Fi |
| **Run Mobile on Android Emulator** | `npm run dev:mobile:android` | Requires Android Studio / ADB |
| **Run Mobile on iOS Simulator** | `npm run dev:mobile:ios` | Requires macOS & Xcode |
| **Run Frontend Tests** | `npm test` | Verifies web & mobile TypeScript without errors |
| **Build Web for Production** | `npm run build:web` | Production bundle in `web/dist` |

---

### Option B: Running Directly in Subdirectories

#### 🌐 Running the Web Application Alone
```powershell
cd web
npm install --legacy-peer-deps
npm run dev
```
* **URL:** [http://localhost:3000](http://localhost:3000)

#### 📱 Running the Mobile Application Alone
```powershell
cd mobile
npm install --legacy-peer-deps
npm run tunnel     # Highly recommended: enables direct connection from any phone / network
# or: npm start
```
* Press `w` to open in browser ([http://localhost:8081](http://localhost:8081))
* Press `a` for Android Emulator
* Press `i` for iOS Simulator
* Scan the terminal QR code in **Expo Go** on your physical phone
