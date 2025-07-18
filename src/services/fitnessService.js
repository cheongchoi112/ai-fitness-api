import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "ai_fitness_coach";

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI);

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
