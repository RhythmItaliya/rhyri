import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    writeBatch
} from "firebase/firestore";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to read .env manually since we're not using dotenv package
const loadEnv = () => {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const envPath = path.resolve(__dirname, '../.env');

        if (!fs.existsSync(envPath)) {
            console.error('.env file not found at', envPath);
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // remove quotes
                env[key] = value;
            }
        });
        return env;
    } catch (error) {
        console.error('Error loading .env:', error);
        process.exit(1);
    }
};

const env = loadEnv();

const firebaseConfig = {
    apiKey: env.VITE_APP_FIREBASE_API_KEY,
    authDomain: env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_APP_FIREBASE_APP_ID,
    measurementId: env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Validate config
if (!firebaseConfig.apiKey) {
    console.error('Missing Firebase config in .env');
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OLD_UID = 'Q5HuXfDOQJMzLIJwVJaV3qEdBjV2';
const NEW_UID = '1O9nlFuP3BUMltAZIxg9UBo828a2';

const COLLECTIONS = ['invoices', 'clients', 'banks', 'companies'];

const migrateCollection = async (collectionName) => {
    console.log(`\nProcessing collection: ${collectionName}...`);
    try {
        const ref = collection(db, collectionName);
        const q = query(ref, where("uid", "==", OLD_UID));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log(`No documents found with the old UID in ${collectionName}.`);
            return;
        }

        console.log(`Found ${snapshot.size} documents in ${collectionName} to migrate.`);

        const batch = writeBatch(db);
        let count = 0;

        snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, { uid: NEW_UID });
            count++;
        });

        if (count > 500) {
            console.error(`Too many documents for a single batch (>500) in ${collectionName}. Aborting to avoid partial failure or errors.`);
            return;
        }

        await batch.commit();
        console.log(`Successfully updated ${count} documents in ${collectionName}.`);

    } catch (error) {
        console.error(`Migration failed for ${collectionName}:`, error);
    }
}

const migrate = async () => {
    console.log('Starting migration...');
    console.log(`Old UID: ${OLD_UID}`);
    console.log(`New UID: ${NEW_UID}`);

    for (const col of COLLECTIONS) {
        await migrateCollection(col);
    }

    console.log('\nMigration process completed.');
};

migrate();
