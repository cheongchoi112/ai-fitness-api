/\*\*

- Progress Service
-
- This service handles operations related to progress tracking, including:
- - Workout history management
- - Weight history management
-
- As this is a prototype, implementation is kept minimal while demonstrating
- the core functionality needed for progress tracking.
  \*/

import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "ai_fitness_coach";
const USERS_COLLECTION = "users";

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI);

/\*\*

- Helper function to ensure progress object exists in user document
  \*/
  const ensureProgressStructure = async (userId) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);

      // Check if user exists and has progress object
      const user = await usersCollection.findOne({ firebaseUserId: userId });

      if (!user) {
        throw new Error("User not found");
      }

      // If progress object doesn't exist, create it with empty arrays
      if (!user.progress) {
        await usersCollection.updateOne(
          { firebaseUserId: userId },
          {
            $set: {
              progress: {
                workoutHistory: [],
                weightHistory: []
              },
              updatedAt: new Date()
            }
          }
        );
      } else {
        // Ensure workout history array exists
        if (!user.progress.workoutHistory) {
          await usersCollection.updateOne(
            { firebaseUserId: userId },
            {
              $set: {
                "progress.workoutHistory": [],
                updatedAt: new Date()
              }
            }
          );
        }

        // Ensure weight history array exists
        if (!user.progress.weightHistory) {
          await usersCollection.updateOne(
            { firebaseUserId: userId },
            {
              $set: {
                "progress.weightHistory": [],
                updatedAt: new Date()
              }
            }
          );
        }
      }

      return user;

  } catch (error) {
  console.error("Error ensuring progress structure:", error);
  throw error;
  }
  };

/\*\*

- Add a new workout entry to the user's workout history
-
- @param {string} userId - Firebase user ID
- @param {Object} workoutData - Workout completion data
- @param {Date} workoutData.date - Date when workout was completed
- @param {string} [workoutData.workoutId] - Reference to specific workout in fitness plan (optional)
- @param {string} [workoutData.notes] - Notes about the workout (optional)
- @returns {Promise<Object>} The created workout entry
  \*/
  export const addWorkoutEntry = async (userId, workoutData) => {
  try {
  await ensureProgressStructure(userId);

      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection(USERS_COLLECTION);

      const workoutEntry = {
        _id: new ObjectId(),
        date: new Date(workoutData.date),
        ...(workoutData.workoutId && { workoutId: workoutData.workoutId }),
        ...(workoutData.notes && { notes: workoutData.notes })
      };

      await usersCollection.updateOne(
        { firebaseUserId: userId },
        {
          $push: { "progress.workoutHistory": workoutEntry },
          $set: { updatedAt: new Date() }
        }
      );

      return workoutEntry;

  } catch (error) {
  console.error("Error adding workout entry:", error);
  throw error;
  }
  };

/\*\*

- Update an existing workout entry
-
- @param {string} userId - Firebase user ID
- @param {string} entryId - ID of the workout entry to update
- @param {Object} workoutData - Updated workout data
- @returns {Promise<Object>} The updated workout entry
  \*/
  export const updateWorkoutEntry = async (userId, entryId, workoutData) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);

      const entryObjectId = new ObjectId(entryId);

      // Build update object based on provided fields
      const updateFields = {};
      if (workoutData.date) updateFields["progress.workoutHistory.$.date"] = new Date(workoutData.date);
      if (workoutData.workoutId !== undefined) updateFields["progress.workoutHistory.$.workoutId"] = workoutData.workoutId;
      if (workoutData.notes !== undefined) updateFields["progress.workoutHistory.$.notes"] = workoutData.notes;

      // Update the entry
      const result = await usersCollection.updateOne(
        {
          firebaseUserId: userId,
          "progress.workoutHistory._id": entryObjectId
        },
        {
          $set: {
            ...updateFields,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Workout entry not found");
      }

      // Fetch the updated entry
      const user = await usersCollection.findOne(
        {
          firebaseUserId: userId,
          "progress.workoutHistory._id": entryObjectId
        },
        { projection: { "progress.workoutHistory.$": 1 } }
      );

      return user?.progress?.workoutHistory[0];

  } catch (error) {
  console.error("Error updating workout entry:", error);
  throw error;
  }
  };

/\*\*

- Delete a workout entry
-
- @param {string} userId - Firebase user ID
- @param {string} entryId - ID of the workout entry to delete
- @returns {Promise<boolean>} True if deletion was successful
  \*/
  export const deleteWorkoutEntry = async (userId, entryId) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);

      const entryObjectId = new ObjectId(entryId);

      const result = await usersCollection.updateOne(
        { firebaseUserId: userId },
        {
          $pull: {
            "progress.workoutHistory": { _id: entryObjectId }
          },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Workout entry not found");
      }

      return true;

  } catch (error) {
  console.error("Error deleting workout entry:", error);
  throw error;
  }
  };

/\*\*

- Get user's workout history
-
- @param {string} userId - Firebase user ID
- @param {Object} options - Query options
- @param {Date} [options.startDate] - Filter entries after this date
- @param {Date} [options.endDate] - Filter entries before this date
- @returns {Promise<Array>} Array of workout entries
  \*/
  export const getWorkoutHistory = async (userId, options = {}) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);
      const user = await usersCollection.findOne(
        { firebaseUserId: userId },
        { projection: { "progress.workoutHistory": 1 } }
      );

      if (!user || !user.progress || !user.progress.workoutHistory) {
        return [];
      }

      let workoutHistory = user.progress.workoutHistory;

      // Apply date filters if provided
      if (options.startDate || options.endDate) {
        workoutHistory = workoutHistory.filter(entry => {
          const entryDate = new Date(entry.date);
          let includeEntry = true;

          if (options.startDate) {
            const startDate = new Date(options.startDate);
            includeEntry = includeEntry && entryDate >= startDate;
          }

          if (options.endDate) {
            const endDate = new Date(options.endDate);
            includeEntry = includeEntry && entryDate <= endDate;
          }

          return includeEntry;
        });
      }

      // Sort by date (newest first)
      return workoutHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
  console.error("Error getting workout history:", error);
  throw error;
  }
  };

/\*\*

- Add a new weight entry to the user's weight history
-
- @param {string} userId - Firebase user ID
- @param {Object} weightData - Weight entry data
- @param {Date} weightData.date - Date when weight was recorded
- @param {number} weightData.weight - Weight value
- @returns {Promise<Object>} The created weight entry
  \*/
  export const addWeightEntry = async (userId, weightData) => {
  try {
  await ensureProgressStructure(userId);

      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection(USERS_COLLECTION);

      const weightEntry = {
        _id: new ObjectId(),
        date: new Date(weightData.date),
        weight: weightData.weight
      };

      await usersCollection.updateOne(
        { firebaseUserId: userId },
        {
          $push: { "progress.weightHistory": weightEntry },
          $set: { updatedAt: new Date() }
        }
      );

      return weightEntry;

  } catch (error) {
  console.error("Error adding weight entry:", error);
  throw error;
  }
  };

/\*\*

- Update an existing weight entry
-
- @param {string} userId - Firebase user ID
- @param {string} entryId - ID of the weight entry to update
- @param {Object} weightData - Updated weight data
- @returns {Promise<Object>} The updated weight entry
  \*/
  export const updateWeightEntry = async (userId, entryId, weightData) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);

      const entryObjectId = new ObjectId(entryId);

      // Build update object based on provided fields
      const updateFields = {};
      if (weightData.date) updateFields["progress.weightHistory.$.date"] = new Date(weightData.date);
      if (weightData.weight !== undefined) updateFields["progress.weightHistory.$.weight"] = weightData.weight;

      // Update the entry
      const result = await usersCollection.updateOne(
        {
          firebaseUserId: userId,
          "progress.weightHistory._id": entryObjectId
        },
        {
          $set: {
            ...updateFields,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Weight entry not found");
      }

      // Fetch the updated entry
      const user = await usersCollection.findOne(
        {
          firebaseUserId: userId,
          "progress.weightHistory._id": entryObjectId
        },
        { projection: { "progress.weightHistory.$": 1 } }
      );

      return user?.progress?.weightHistory[0];

  } catch (error) {
  console.error("Error updating weight entry:", error);
  throw error;
  }
  };

/\*\*

- Delete a weight entry
-
- @param {string} userId - Firebase user ID
- @param {string} entryId - ID of the weight entry to delete
- @returns {Promise<boolean>} True if deletion was successful
  \*/
  export const deleteWeightEntry = async (userId, entryId) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);

      const entryObjectId = new ObjectId(entryId);

      const result = await usersCollection.updateOne(
        { firebaseUserId: userId },
        {
          $pull: {
            "progress.weightHistory": { _id: entryObjectId }
          },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Weight entry not found");
      }

      return true;

  } catch (error) {
  console.error("Error deleting weight entry:", error);
  throw error;
  }
  };

/\*\*

- Get user's weight history
-
- @param {string} userId - Firebase user ID
- @param {Object} options - Query options
- @param {Date} [options.startDate] - Filter entries after this date
- @param {Date} [options.endDate] - Filter entries before this date
- @returns {Promise<Array>} Array of weight entries
  \*/
  export const getWeightHistory = async (userId, options = {}) => {
  try {
  await client.connect();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection(USERS_COLLECTION);
      const user = await usersCollection.findOne(
        { firebaseUserId: userId },
        { projection: { "progress.weightHistory": 1 } }
      );

      if (!user || !user.progress || !user.progress.weightHistory) {
        return [];
      }

      let weightHistory = user.progress.weightHistory;

      // Apply date filters if provided
      if (options.startDate || options.endDate) {
        weightHistory = weightHistory.filter(entry => {
          const entryDate = new Date(entry.date);
          let includeEntry = true;

          if (options.startDate) {
            const startDate = new Date(options.startDate);
            includeEntry = includeEntry && entryDate >= startDate;
          }

          if (options.endDate) {
            const endDate = new Date(options.endDate);
            includeEntry = includeEntry && entryDate <= endDate;
          }

          return includeEntry;
        });
      }

      // Sort by date (newest first)
      return weightHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
  console.error("Error getting weight history:", error);
  throw error;
  }
  };
