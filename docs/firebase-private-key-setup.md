# Firebase Private Key Setup Guide

This guide will help you properly set up the Firebase Admin SDK credentials in your `.env` file to avoid common formatting issues.

## Option 1: Using Individual Credential Parts (Recommended for development)

1. Go to your Firebase project console: https://console.firebase.google.com/
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Open the JSON file and extract the required fields
6. Add them to your `.env` file as follows:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com

# IMPORTANT: For the private key, you must:
# 1. Include the entire key including BEGIN and END markers
# 2. Ensure all newlines are preserved as literal \n characters
# 3. Wrap the entire key in double quotes

FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEF...your entire key here...1QY1BKOQpM=\n-----END PRIVATE KEY-----\n"
```

## Option 2: Using the Entire Service Account JSON (Alternative approach)

If you're having issues with the private key format, you can use the entire service account JSON:

1. Convert the entire JSON file to a string
2. Set it as a single environment variable

```
FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nMII..."}
```

## Common Private Key Formatting Issues

1. **Newlines**: The private key must contain literal `\n` characters. In your .env file, it should look like:

   ```
   "-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
   ```

2. **Quotes**: The entire private key should be wrapped in double quotes in your `.env` file.

3. **Special characters**: Make sure there are no extra whitespace or special characters.

## Testing Your Configuration

To test if your Firebase Admin SDK is correctly initialized, you can add this script:

```javascript
// test-firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

try {
  // Initialize Firebase with your env vars
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  console.log("Firebase initialized successfully!");
  console.log("Project ID:", app.options.credential.projectId);

  // Clean up
  admin.app().delete();
} catch (error) {
  console.error("Firebase initialization failed:", error);
}
```

Run with: `node test-firebase.js`

## Need Help?

If you're still having issues, consider:

1. Double-check the formatting in your .env file
2. Try the alternative approach (Option 2)
3. Ensure you've copied the entire private key correctly
4. Check that there are no extra spaces at the beginning or end of the key
