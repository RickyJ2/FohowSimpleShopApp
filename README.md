# Fohow Simple Shop App

A streamlined inventory and shop management application built for speed and ease of use. This app is specifically optimized for mobile performance and features an elder-friendly UI to ensure accessibility for all users.

## 🚀 Key Features

- **Intuitive Dashboard**: Simplified navigation hub for all core business operations.
- **Smart Inventory Management**:
  - Collapsible product groups for a clean overview.
  - Detailed batch tracking (Production Date, Expiry Date, and Stock).
  - Visual stock status indicators (Green for available, Red for out of stock).
- **Fast Debounced Search**: Quickly find items in large inventories with a high-performance filtering system.
- **Mobile-First Design**: Fully responsive layout that adapts dynamically to any screen size without cropping text.
- **Elder-Friendly UI**: Large touch targets, high-contrast colors, and optimized typography for maximum readability on budget-friendly and older smartphones.
- **Capacitor Integration**: Native Android experience with optimized SDK configurations.

## 🛠 Tech Stack

- **Core**: React 19 + TypeScript
- **Bundler**: Vite 8
- **UI Framework**: Material UI (MUI)
- **Mobile Wrapper**: Capacitor v8
- **Styling**: Emotion + Custom Responsive System

## 📦 Getting Started

### Prerequisites

- **Node.js**: Latest LTS version
- **Android Studio**: For mobile builds
- **Java JDK 17**: Required for Android compilation

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the app in your browser:

```bash
npm run dev
```

---

## 📱 Mobile Build & Deployment (Android)

This project uses the **"Antigravity Spec"** for maximum stability on Android devices.

### 1. Build the Web Assets

```bash
npm run build
```

### 2. Sync to Android Project

```bash
npx cap sync
```

### 3. Generate APK

1. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
2. **Configuration Check**:
   - Ensure **Gradle JDK** is set to **JDK 17**.
   - **Compile SDK**: 36
   - **Target SDK**: 36
   - **Min SDK**: 24 (Supports Android 7.0+)
3. Build the APK:
   - Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.

## 🎨 Asset Management

To update the app icons or splash screens, place your `hero.png` in the `assets/` folder and run:

```bash
npx capacitor-assets generate --android
```

---
