// A simple script to test Firebase Admin SDK initialization and generate tokens
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

console.log("Testing Firebase Admin SDK initialization...");

// First, let's check if the required environment variables are set
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

console.log("\nEnvironment variables check:");
console.log("- FIREBASE_PROJECT_ID:", projectId ? "✓ Set" : "❌ Not set");
console.log(
  "- FIREBASE_ADMIN_CLIENT_EMAIL:",
  clientEmail ? "✓ Set" : "❌ Not set"
);
console.log(
  "- FIREBASE_ADMIN_PRIVATE_KEY:",
  privateKey ? "✓ Set" : "❌ Not set"
);
console.log(
  "- FIREBASE_ADMIN_SERVICE_ACCOUNT:",
  serviceAccount ? "✓ Set" : "❌ Not set"
);

// Try different initialization methods
try {
  let app;

  console.log("\nAttempting Firebase initialization...");

  // Method 1: Try with service account JSON string
  if (serviceAccount) {
    console.log("Method 1: Using FIREBASE_ADMIN_SERVICE_ACCOUNT...");
    try {
      const parsedServiceAccount = JSON.parse(serviceAccount);
      app = admin.initializeApp(
        {
          credential: admin.credential.cert(parsedServiceAccount),
        },
        "test-app-1"
      );
      console.log(
        "✅ Method 1 successful! Firebase initialized with service account JSON."
      );
    } catch (error) {
      console.error("❌ Method 1 failed:", error.message);
    } finally {
      if (admin.apps.some((a) => a && a.name === "test-app-1")) {
        await admin.app("test-app-1").delete();
      }
    }
  }

  // Method 2: Try with individual credential parts
  if (projectId && clientEmail && privateKey) {
    console.log("\nMethod 2: Using individual credentials...");
    try {
      // Try with different private key formatting approaches
      console.log(
        '- Attempt 1: Using private key with .replace(/\\\\n/g, "\\n")'
      );
      const formattedKey1 = privateKey.replace(/\\n/g, "\n");
      app = admin.initializeApp(
        {
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedKey1,
          }),
        },
        "test-app-2a"
      );
      console.log("✅ Attempt 1 successful!");
    } catch (error) {
      console.error("❌ Attempt 1 failed:", error.message);

      // Try alternative formatting
      try {
        console.log("- Attempt 2: Using private key without any processing");
        app = admin.initializeApp(
          {
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          },
          "test-app-2b"
        );
        console.log("✅ Attempt 2 successful!");
      } catch (error) {
        console.error("❌ Attempt 2 failed:", error.message);
      } finally {
        if (admin.apps.some((a) => a && a.name === "test-app-2b")) {
          await admin.app("test-app-2b").delete();
        }
      }
    } finally {
      if (admin.apps.some((a) => a && a.name === "test-app-2a")) {
        await admin.app("test-app-2a").delete();
      }
    }
  }

  console.log("\n========== DIAGNOSIS ==========");
  if (admin.apps.length > 0) {
    console.log("✅ SUCCESS: Firebase Admin SDK initialized successfully!");

    // Which method worked
    if (admin.apps.some((a) => a && a.name === "test-app-1")) {
      console.log("Using method: Service Account JSON string");
    } else if (admin.apps.some((a) => a && a.name === "test-app-2a")) {
      console.log(
        "Using method: Individual credentials with newline replacement"
      );
    } else if (admin.apps.some((a) => a && a.name === "test-app-2b")) {
      console.log("Using method: Individual credentials without processing");
    }
  } else {
    console.log("❌ FAILURE: Could not initialize Firebase Admin SDK.");
    console.log("\nPossible solutions:");
    console.log(
      "1. Check your .env file format - see docs/firebase-private-key-setup.md"
    );
    console.log("2. Verify your Firebase service account credentials");
    console.log(
      "3. Make sure your Firebase project is properly set up with service accounts enabled"
    );
    console.log(
      "\nFor more help, refer to the Firebase Admin SDK documentation:"
    );
    console.log("https://firebase.google.com/docs/admin/setup");
  }
} catch (error) {
  console.error("\nUnexpected error during testing:", error);
}

/**
 * Generate a custom token for testing using the Admin SDK
 * This is different from the client-side authentication in get-firebase-token.js
 * as it uses the Admin SDK to create tokens without requiring user passwords
 *
 * @param {string} uid - User ID to create token for (can be any string)
 * @param {Object} [claims] - Optional custom claims to include in the token
 * @returns {Promise<string>} Firebase custom token
 */
async function generateTestToken(uid, claims = {}) {
  try {
    // Make sure Firebase Admin is initialized before continuing
    if (admin.apps.length === 0) {
      console.error(
        "Firebase Admin SDK is not initialized. Cannot generate token."
      );
      return null;
    }

    // Generate a custom token using the Admin SDK
    const customToken = await admin.auth().createCustomToken(uid, claims);

    console.log("\n===== CUSTOM TOKEN (FOR EXCHANGE) =====");
    console.log(customToken);
    console.log("=====================================\n");
    console.log(
      "Note: This is a custom token that must be exchanged for an ID token."
    );
    console.log("For direct API testing, use get-firebase-token.js instead.\n");

    return customToken;
  } catch (error) {
    console.error("Error generating custom token:", error);
    return null;
  }
}

// If this script is called with a UID parameter, generate a token
if (process.argv.length >= 3) {
  const uid = process.argv[2];
  console.log(`\nGenerating test token for user ID: ${uid}`);

  // Optional claims if provided as JSON string in 4th argument
  let claims = {};
  if (process.argv.length >= 4) {
    try {
      claims = JSON.parse(process.argv[3]);
      console.log("Including custom claims:", claims);
    } catch (e) {
      console.error("Invalid JSON for custom claims:", process.argv[3]);
      process.exit(1);
    }
  }

  generateTestToken(uid, claims)
    .then(() => {
      console.log("Token generation complete.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Token generation failed:", error);
      process.exit(1);
    });
}
