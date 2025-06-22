// A script to get a Firebase authentication token using email/password
// This is useful for testing protected API endpoints

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

// Check if Firebase client config is available
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

// Validate config
const missingKeys = Object.keys(firebaseConfig).filter(
  (key) => !firebaseConfig[key]
);
if (missingKeys.length > 0) {
  console.error("❌ Missing Firebase configuration:", missingKeys.join(", "));
  console.error("Please add these to your .env file");
  process.exit(1);
}

// Initialize Firebase client
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Get a Firebase authentication token for an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<string>} Firebase ID token
 */
async function getTokenFromFirebase(email, password) {
  try {
    console.log(`Attempting to sign in as ${email}...`);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Authentication successful!");
    console.log("User UID:", user.uid);
    console.log("User Email:", user.email);

    const token = await user.getIdToken();
    console.log("\n===== YOUR AUTH TOKEN =====");
    console.log(token);
    console.log("===========================\n");

    console.log("To use this token with curl:");
    console.log(
      `curl -H "Authorization: Bearer ${token}" http://localhost:8080/api/protected-endpoint`
    );

    console.log("\nTo use this token with Postman:");
    console.log("1. In the Headers tab, add a header:");
    console.log("   Key: Authorization");
    console.log(`   Value: Bearer ${token}`);

    return token;
  } catch (error) {
    console.error("❌ Authentication failed:", error.message);
    throw error;
  }
}

/**
 * Create a new user and get a token (useful for testing)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<string>} Firebase ID token
 */
async function createUserAndGetToken(email, password) {
  try {
    console.log(`Attempting to create user ${email}...`);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ User created successfully!");
    console.log("User UID:", user.uid);
    console.log("User Email:", user.email);

    const token = await user.getIdToken();
    console.log("\n===== YOUR AUTH TOKEN =====");
    console.log(token);
    console.log("===========================\n");

    return token;
  } catch (error) {
    console.error("❌ User creation failed:", error.message);
    if (error.code === "auth/email-already-in-use") {
      console.log("This user already exists. Trying to sign in instead...");
      return getTokenFromFirebase(email, password);
    }
    throw error;
  }
}

// Main function to run when script is executed directly
async function main() {
  try {
    // Get the command line arguments
    const args = process.argv.slice(2);
    const command = args[0]?.toLowerCase();
    const email = args[1];
    const password = args[2];

    if (!command || !email || !password) {
      console.log("Usage:");
      console.log("  Get token for existing user:");
      console.log(
        "    node get-firebase-token.js login user@example.com password123"
      );
      console.log("  Create new user and get token:");
      console.log(
        "    node get-firebase-token.js signup user@example.com password123"
      );
      process.exit(1);
    }

    if (command === "login") {
      await getTokenFromFirebase(email, password);
    } else if (command === "signup") {
      await createUserAndGetToken(email, password);
    } else {
      console.error(`Unknown command: ${command}. Use 'login' or 'signup'.`);
    }
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the main function if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Import fileURLToPath for ES modules
import { fileURLToPath } from "url";

// Export functions for use in other scripts
export { getTokenFromFirebase, createUserAndGetToken };
