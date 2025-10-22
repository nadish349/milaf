// Firebase Admin SDK with service account authentication
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let db;
let adminApp;

try {
  // Check if Firebase Admin is already initialized
  if (admin.apps.length === 0) {
    // Try to load service account key
    const serviceAccountPath = join(__dirname, 'service-account-key.json');
    
    if (existsSync(serviceAccountPath)) {
      // Use service account key for authentication
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'milafcola-australia'
      });
      console.log('🔥 Firebase Admin SDK initialized with service account key');
    } else {
      // Fallback to project ID only
      adminApp = admin.initializeApp({
        projectId: 'milafcola-australia'
      });
      console.log('🔥 Firebase Admin SDK initialized with project ID');
      console.log('💡 For better reliability, add service-account-key.json file');
    }
  } else {
    adminApp = admin.app();
    console.log('🔥 Firebase Admin SDK already initialized');
  }
  
  db = admin.firestore();
  
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.log('💡 Using project ID authentication for order creation');
  console.log('💡 This should work for order creation and inventory management');
  throw new Error('Firebase Admin SDK initialization failed');
}

export { db, admin, adminApp };
