import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "ai_fitness_coach";
const COLLECTION_NAME = "users";

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI);

/**
 * Create a new user
 * @param {Object} userData - User data to insert
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Check if user with same email already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Add creation timestamp
    const userToInsert = {
      ...userData,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(userToInsert);
    return { ...userToInsert, _id: result.insertedId };
  } catch (error) {
    throw error;
  }
};

/**
 * Find user by email and password for login
 * @param {string} email - User email
 * @param {string} password - User password (plain text as per requirements)
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const findUserByCredentials = async (email, password) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Find user by email and password
    return await usersCollection.findOne({ email, password });
  } catch (error) {
    throw error;
  }
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const findUserById = async (userId) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    return await usersCollection.findOne({ _id: userId });
  } catch (error) {
    throw error;
  }
};

/**
 * Update user data
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, updateData) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const result = await usersCollection.findOneAndUpdate(
      { _id: userId },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteUser = async (userId) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const result = await usersCollection.deleteOne({ _id: userId });
    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
};
