# Firebase Authentication Testing Utilities

This directory contains utilities for testing Firebase Authentication with your AI Fitness API.

## Get Firebase Token (Client Method)

Use `get-firebase-token.js` to get a real Firebase ID token using email/password authentication:

### For existing users:

```bash
node get-firebase-token.js login user@example.com password123
```

### For new users (will create the user first):

```bash
node get-firebase-token.js signup user@example.com password123
```

This method uses the Firebase client SDK and is closest to how real clients will authenticate.

## Generate Test Token (Admin Method)

Use `test-firebase.js` with a user ID parameter to generate a custom token using the Admin SDK:

```bash
node test-firebase.js test-user-123
```

With custom claims:

```bash
node test-firebase.js test-user-123 '{"admin": true, "premium": true}'
```

Note: Custom tokens must be exchanged for ID tokens before using with your API.

## Using the Token with API Requests

### With cURL:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:8080/api/protected-endpoint
```

### With Postman:

1. Add an "Authorization" header
2. Set the value to: `Bearer YOUR_TOKEN_HERE`
3. Send your request

## Troubleshooting

If you encounter issues with token generation:

1. Make sure your Firebase project is properly configured
2. Check that your .env file contains all required Firebase configuration
3. Verify that Firebase Authentication is enabled in the Firebase Console
4. For admin SDK issues, check your service account key permissions
