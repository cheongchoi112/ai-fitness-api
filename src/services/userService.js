import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "ai_fitness_coach";
const COLLECTION_NAME = "users";

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI);

/**
 * Create or update user profile with onboarding data
 * @param {string} userId - Firebase user ID
 * @param {Object} userData - User data including userInfo and profile
 * @returns {Promise<Object>} Updated user object
 */
export const createOrUpdateUserProfile = async (userId, userData) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      firebaseUserId: userId,
    });

    if (existingUser) {
      // Update existing user
      const result = await usersCollection.updateOne(
        { firebaseUserId: userId },
        {
          $set: {
            userInfo: userData.userInfo,
            profile: userData.profile,
            updatedAt: new Date(),
          },
        }
      );

      return await usersCollection.findOne({ firebaseUserId: userId });
    } else {
      // Create new user
      const newUser = {
        firebaseUserId: userId,
        userInfo: userData.userInfo,
        profile: userData.profile,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
  }
};

// formatUserDataForAI function has been moved to aiFitnessServiceGemini.js

// saveFitnessPlan function has been moved to fitnessService.js

/**
 * Find a user by Firebase userId and retrieve their fitness plan
 * @param {string} firebaseUserId - Firebase user ID
 * @returns {Promise<Object|null>} User and fitness plan or null if not found
 */
export const getUserWithFitnessPlan = async (firebaseUserId) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);
    const plansCollection = db.collection("fitnessPlans");

    // Find the user
    const user = await usersCollection.findOne({ firebaseUserId });

    if (!user) {
      return null;
    }

    // Find the associated fitness plan
    const fitnessPlan = await plansCollection.findOne({
      userId: firebaseUserId,
    });

    // Return both user and fitness plan
    return {
      user,
      fitnessPlan: fitnessPlan || null,
    };
  } catch (error) {
    console.error("Error finding user with fitness plan:", error);
    throw error;
  }
};

/**
 * Delete user data from both users and fitnessPlans collections
 * @param {string} firebaseUserId - Firebase user ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteUser = async (firebaseUserId) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);
    const plansCollection = db.collection("fitnessPlans");

    // Check if user exists before attempting deletion
    const user = await usersCollection.findOne({ firebaseUserId });
    if (!user) {
      return { userFound: false, message: "User not found" };
    }

    // Delete user from users collection
    const userDeleteResult = await usersCollection.deleteOne({
      firebaseUserId,
    });

    // Delete associated fitness plan
    const planDeleteResult = await plansCollection.deleteOne({
      userId: firebaseUserId,
    });

    return {
      userFound: true,
      userDeleted: userDeleteResult.deletedCount > 0,
      planDeleted: planDeleteResult.deletedCount > 0,
      message: "User data deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};
