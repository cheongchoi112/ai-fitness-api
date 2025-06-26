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

/**
 * Format user data for AI request
 * @param {Object} userData - User profile data
 * @returns {Object} Formatted data for AI service
 */
export const formatUserDataForAI = (userData) => {
  // Map user profile data to the format expected by Gemini API
  // Extract profile data if it's passed as a full user object
  const profile = userData.profile || userData;

  return {
    personal_goals_experience: {
      primary_fitness_goal: profile.personalGoalsExperience?.primaryFitnessGoal,
      current_weight_lbs: profile.personalGoalsExperience?.currentWeightLbs,
      desired_weight_lbs: profile.personalGoalsExperience?.desiredWeightLbs,
      height_cms: profile.personalGoalsExperience?.heightCms,
      current_fitness_level:
        profile.personalGoalsExperience?.currentFitnessLevel,
      age_group: profile.personalGoalsExperience?.ageGroup,
    },
    schedule_availability: {
      days_per_week_workout: profile.scheduleAvailability?.daysPerWeekWorkout,
      preferred_workout_time:
        profile.scheduleAvailability?.preferredWorkoutTimes,
    },
    equipment_access: {
      equipment: profile.equipmentAccess?.equipment,
      workout_location: profile.equipmentAccess?.location,
    },
    dietary_preferences: {
      primary_dietary_preference:
        profile.dietaryPreferences?.primaryDietaryPreference,
      restrictions_allergies: profile.dietaryPreferences?.restrictionsAllergies,
    },
    health_considerations: {
      injuries_conditions: profile.healthConsiderations?.medicalConditions,
      workout_types_to_avoid: profile.healthConsiderations?.workoutsToAvoid,
    },
    preferences_motivation: {
      enjoyed_workout_types: profile.preferencesMotivation?.enjoyedWorkoutTypes,
    },
  };
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
