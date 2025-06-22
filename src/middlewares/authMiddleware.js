import { auth } from "../config/firebase.js";

/**
 * Middleware to verify Firebase Auth token
 * This middleware checks for a valid Firebase Authentication token in the request headers
 * If valid, it adds the decoded token claims to the request object as req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Extract token from header
    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token format" });
    }

    try {
      // Verify the token with Firebase Admin
      const decodedToken = await auth.verifyIdToken(token);

      // Add the decoded token to the request object
      req.user = decodedToken;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during authentication" });
  }
};

export default authMiddleware;
