# [Rhyri](https://pay-up-roan.vercel.app)

An invoice app built with react and firebase

## Tech Stack

- **UI Library:** [React.js](https://react.dev)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **User & Data Management:** [Firebase](https://firebase.google.com)
- **Asynchronous state:** [Tanstack Query](https://tanstack.com/query/v5)
- **Headless Components:** [radix/ui](https://radix-ui.com/)
- **Form Validation:** [react-hook-form](https://react-hook-form.com/)
- **Chart Library:** [rechart](https://recharts.org/)

## Features to be implemented

- [x] Authentication with **firebase**
- [x] dashboard
- [x] Create, update, and delete Invoice
- [x] Invoices filtering and search
- [x] Pagination
- [x] Theme toggling

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/RhythmItaliya/invoice-firebase.git
   ```

2. Install dependencies using npm

   ```bash
   npm install
   ```

3. Copy the `.env.example` to `.env.local` and update the variables. Here is a template for the `.env.local` file:

   ```plaintext
   VITE_APP_FIREBASE_API_KEY=
   VITE_APP_FIREBASE_AUTH_DOMAIN=
   VITE_APP_FIREBASE_PROJECT_ID=
   VITE_APP_FIREBASE_STORAGE_BUCKET=
   VITE_APP_FIREBASE_MESSAGING_SENDER_ID=
   VITE_APP_FIREBASE_APP_ID=
   VITE_APP_FIREBASE_MEASUREMENT_ID=
   ```

4. Configure Firebase:

   - Go to the [Firebase Console](https://firebase.google.com/).
   - Click on "Go to Console" in the top-right corner.
   - Click on "Add project" to create a new project.
   - Follow the prompts to set up your project.
   - After creating the project, click on "Web" (</>) to register your web app.
   - Follow the prompts to register your app. You will receive a Firebase configuration snippet with keys and identifiers.
   - Copy the configuration values and paste them into your `.env.local` file.

5. Set up Firebase Authentication:

   - In the Firebase Console, navigate to "Authentication" in the left sidebar.
   - Click on "Get Started."
   - Enable the authentication methods you want to support (e.g., Email/Password, Google).

6. Set up Firestore Database:

   - In the Firebase Console, navigate to "Firestore Database" in the left sidebar.
   - Click on "Create database."
   - Choose "Start in Test Mode" to allow read and write access (you will secure this later).
   - Click "Next" and then "Done."

7. Configure Firestore Rules:

   - In the Firestore Database section, go to the "Rules" tab.
   - Replace the existing rules with the following:

     ```plaintext
     rules_version = '2';
     
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```

   - Click "Publish" to apply the rules.

8. Create Firestore Indexes:

   - In the Firestore Database section, go to the "Indexes" tab.
   - Click "Add Index."
   - Configure the index for the `invoices` collection with the following fields:
     - **Field 1:** `uid` (Ascending)
     - **Field 2:** `invoiceDate` (Descending)
     - **Field 3:** `invoiceStatus` (Ascending)
   - Enable the index and save.

9. Start the development server

    ```bash
    npm run dev
    ```

## Deployment

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) to set up the project and deploy it.