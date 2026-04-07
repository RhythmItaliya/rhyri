# [Rhyri](https://www.rhyri.com)

Rhyri is a professional-grade invoice management platform designed for efficiency, clarity, and enterprise-ready administration. Built with a modern tech stack, it empowers businesses to generate, manage, and track high-quality invoices with absolute ease.

Designed and developed by [Rhythm Italiya](https://rhythmitaliya.com/).

---

## Core Features

- **Professional PDF Generation:** Create high-fidelity, production-ready invoices in seconds.
- **Enterprise-Ready Administration:** A robust admin panel (protected by VITE_ADMIN_EMAIL) for managing users and setting granular document restrictions.
- **Advanced Global Restrictions:** Administrators can hide or disable invoices based on specific dates, ensuring strict data governance at both UI and database levels.
- **Real-time Financial Dashboard:** Gain immediate insights into revenue, growth, and billing status through a synchronized Firestore-powered interface.
- **PWA and Offline Readiness:** Full Progressive Web App support with optimized background caching for a seamless experience on any device.
- **SEO Excellence:** Exhaustive SEO implementation including Schema.org JSON-LD, automated sitemaps, and optimized search crawler directives.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RhythmItaliya/rhyri.git
```

### 2. Install dependencies

```bash
npm i
```

### 3. Environment Configuration

Copy the example environment file and update it with your own credentials:

```bash
cp .env.example .env
```

Open .env and fill in the following variables:

```env
VITE_APP_FIREBASE_API_KEY=
VITE_APP_FIREBASE_AUTH_DOMAIN=
VITE_APP_FIREBASE_PROJECT_ID=
VITE_APP_FIREBASE_STORAGE_BUCKET=
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=
VITE_APP_FIREBASE_APP_ID=
VITE_APP_FIREBASE_MEASUREMENT_ID=

VITE_PDF_API_URL=
VITE_ADMIN_EMAIL=
```

### 4. Firebase Setup

To set up the backend for Rhyri:

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and activate the Google sign-in provider.
3. Create a **Firestore Database** in production or test mode.
4. (Optional) Set up **Firebase Hosting** for deployment.
5. Copy your web app's configuration into the .env file as shown above.

### 5. Run the development server

```bash
npm run dev
```

## Deployment

Rhyri is optimized for deployment on Vercel. Simply connect your repository and the vercel.json provides pre-configured headers for optimal caching and SEO performance.

---

Made by [Rhythm Italiya](https://rhythmitaliya.com/)