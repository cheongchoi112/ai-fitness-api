import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "ai_fitness_coach";

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI);

/**
 * Toggle workout completion for a specific date
 * Note: Only the day will be considered, time will be set to 00:00:00
 *
 * @param {string} userId - Firebase user ID
 * @param {Date} date - Date when the workout was completed
 * @returns {Promise<Object>} Updated fitness plan with progress
 */
export const toggleWorkoutCompletion = async (userId, date) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const plansCollection = db.collection("fitnessPlans");

    // Find the user's fitness plan
    const userPlan = await plansCollection.findOne({ userId });

    if (!userPlan) {
      throw new Error("Fitness plan not found for the user");
    }

    // Normalize the date to midnight to consider only the day part
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Check if progress array exists, if not create it
    if (!userPlan.progress) {
      userPlan.progress = [];
    }

    // Check if the date already exists in progress
    const dateExists = userPlan.progress.some(
      (progressDate) =>
        new Date(progressDate).getTime() === normalizedDate.getTime()
    );

    let updatedProgress;
    if (dateExists) {
      // Remove the date if it already exists
      updatedProgress = userPlan.progress.filter(
        (progressDate) =>
          new Date(progressDate).getTime() !== normalizedDate.getTime()
      );
    } else {
      // Add the date if it doesn't exist
      updatedProgress = [...userPlan.progress, normalizedDate];
    }

    // Update the progress in the database
    await plansCollection.updateOne(
      { userId },
      {
        $set: {
          progress: updatedProgress,
          updatedAt: new Date(),
        },
      }
    );

    // Return the updated plan
    return await plansCollection.findOne({ userId });
  } catch (error) {
    console.error("Error toggling workout completion:", error);
    throw error;
  }
};

/**
 * Save fitness plan to MongoDB
 * @param {string} userId - Firebase user ID
 * @param {Object} plan - Generated fitness plan
 * @returns {Promise<Object>} Saved plan object
 */
export const saveFitnessPlan = async (userId, plan) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const plansCollection = db.collection("fitnessPlans");

    // Check if user already has a plan
    const existingPlan = await plansCollection.findOne({ userId });

    if (existingPlan) {
      // Update existing plan
      await plansCollection.updateOne(
        { userId },
        {
          $set: {
            plan: plan,
            updatedAt: new Date(),
          },
        }
      );

      return await plansCollection.findOne({ userId });
    } else {
      // Create new plan
      const newPlan = {
        userId,
        plan,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await plansCollection.insertOne(newPlan);
      return newPlan;
    }
  } catch (error) {
    console.error("Error saving fitness plan:", error);
    throw error;
  }
};
