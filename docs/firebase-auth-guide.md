# Firebase Authentication Guide

This document explains how Firebase Authentication is implemented in the AI Fitness API.

## Overview

Our API uses Firebase Authentication with a clean separation of concerns:

- **Frontend**: Handles all user authentication through the Firebase SDK
- **Backend**: Only validates Firebase tokens and authorizes requests

## Frontend Implementation (Client-side)

The frontend application should:

1. Implement Firebase SDK for authentication
2. Handle user registration, login, and password reset
3. Store the Firebase token (JWT) securely
4. Include the token in all API requests as a Bearer token

Example frontend authentication flow:

```javascript
// Initialize Firebase in your frontend app
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up a new user
async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // You now have a Firebase user
    const token = await user.getIdToken();
    // Use this token for API requests
    return token;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

// Login an existing user
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    // Use this token for API requests
    return token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Making an authenticated API request
async function fetchProtectedResource() {
  const token = await auth.currentUser.getIdToken();

  const response = await fetch("https://your-api.com/api/protected-resource", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}
```

## Backend Implementation (Server-side)

The backend:

1. Uses Firebase Admin SDK to verify tokens
2. Has middleware that checks the Authorization header
3. Rejects requests with invalid/missing tokens
4. Maps Firebase UIDs to internal user records as needed

All protected routes use the `authMiddleware` which:

- Extracts the JWT token from the Authorization header
- Verifies the token with Firebase Admin
- Makes the user's Firebase data available in `req.user`
- Allows the request to continue if the token is valid

## Security Considerations

1. **Token Expiration**: Firebase tokens expire after 1 hour by default
2. **Scope of Access**: Each token can only access resources owned by that user
3. **Error Handling**: Invalid tokens result in 401 Unauthorized responses

## Testing Authentication

You can test authentication by:

1. Creating a test user in the Firebase console
2. Generating a token for that user
3. Including the token in API requests

## Troubleshooting

Common issues:

- **401 Unauthorized**: Token is missing, expired, or invalid
- **403 Forbidden**: Token is valid but lacks permission for the requested resource
- **Firebase SDK Errors**: Check Firebase console for authentication issues

For further assistance, consult the [Firebase Authentication documentation](https://firebase.google.com/docs/auth).
