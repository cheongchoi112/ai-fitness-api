import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Check if Firebase Admin is already initialized to prevent multiple initializations
if (!admin.apps.length) {
  try {
    // Option 1: Try using service account credentials directly
    if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      // If the service account is provided as a JSON string in .env
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    // Option 2: Use individual credential parts
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ) {
      // Handle the private key format
      // The key needs to be properly formatted with newlines
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }
    // Option 3: Fall back to application default credentials if no explicit credentials
    else {
      admin.initializeApp();
    }

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Throw the error so the application fails fast rather than proceeding with broken auth
    throw error;
  }
}

export const auth = admin.auth();
export default admin;
