/**
 * Progress Metrics Service
 *
 * Provides functionality to calculate metrics based on user's progress data
 * This is a prototype implementation with minimal code to demonstrate functionality
 */

import { getUserWithFitnessPlan } from "./userService.js";
import { getWorkoutHistory, getWeightHistory } from "./progressService.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Calculate metrics for weight history
 *
 * @param {Array} weightHistory - User's weight history
 * @param {Object} userProfile - User's profile containing weight goal
 * @returns {Object} Weight metrics
 */
const calculateWeightMetrics = (weightHistory, userProfile) => {
  if (!weightHistory || weightHistory.length === 0) {
    return {
      noData: true,
      message: "No weight history data available",
    };
  }

  // Sort weight entries by date (oldest first for calculations)
  const sortedEntries = [...weightHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Basic statistics
  const weights = sortedEntries.map((entry) => parseFloat(entry.weight)); // Ensure all weights are numbers
  const firstEntry = sortedEntries[0];
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  const averageWeight =
    weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const totalChange =
    parseFloat(lastEntry.weight) - parseFloat(firstEntry.weight);

  // Calculate rate of change (per week)
  const firstDate = new Date(firstEntry.date);
  const lastDate = new Date(lastEntry.date);
  const weeksDiff = (lastDate - firstDate) / (7 * 24 * 60 * 60 * 1000) || 1; // Avoid division by zero
  const weeklyChangeRate = totalChange / weeksDiff;

  // Goal tracking
  let goalMetrics = { hasGoal: false };
  if (userProfile && userProfile.profile && userProfile.profile.desiredWeight) {
    const desiredWeight = parseFloat(userProfile.profile.desiredWeight);
    const currentWeight = parseFloat(lastEntry.weight);
    const distanceToGoal = currentWeight - desiredWeight;

    // Estimated weeks to reach goal based on current trend
    let estimatedWeeksToGoal = null;
    if (Math.abs(weeklyChangeRate) > 0.01) {
      // Only if there's a meaningful change rate
      estimatedWeeksToGoal = distanceToGoal / -weeklyChangeRate; // Negative because we want to know how long to reach lower weight
    }

    // Only calculate percentage if user is trying to lose weight and current > desired, or trying to gain weight and current < desired
    const initialDistanceToGoal = parseFloat(firstEntry.weight) - desiredWeight;
    let percentageAchieved = null;

    if (initialDistanceToGoal !== 0) {
      // Avoid division by zero
      percentageAchieved =
        ((initialDistanceToGoal - distanceToGoal) /
          Math.abs(initialDistanceToGoal)) *
        100;
    }

    goalMetrics = {
      hasGoal: true,
      desiredWeight,
      currentWeight,
      distanceToGoal,
      estimatedWeeksToGoal:
        estimatedWeeksToGoal > 0 ? estimatedWeeksToGoal : null, // Only show positive values
      percentageAchieved:
        percentageAchieved !== null ? Math.max(0, percentageAchieved) : null, // Only show non-negative values
    };
  }

  return {
    basicStats: {
      totalEntries: weightHistory.length,
      averageWeight: parseFloat(averageWeight.toFixed(1)),
      minWeight,
      maxWeight,
      totalChange: parseFloat(totalChange.toFixed(1)),
      currentWeight: parseFloat(lastEntry.weight),
      startingWeight: parseFloat(firstEntry.weight),
    },
    trends: {
      weeklyChangeRate: parseFloat(weeklyChangeRate.toFixed(2)),
    },
    goalTracking: goalMetrics,
  };
};

/**
 * Calculate metrics for workout history
 *
 * @param {Array} workoutHistory - User's workout history
 * @returns {Object} Workout metrics
 */
const calculateWorkoutMetrics = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) {
    return {
      noData: true,
      message: "No workout history data available",
    };
  }

  // Sort workout entries by date (oldest first for calculations)
  const sortedEntries = [...workoutHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Basic statistics
  const totalWorkouts = workoutHistory.length;

  // Calculate date range and get days in range
  const firstDate = new Date(sortedEntries[0].date);
  const lastDate = new Date(sortedEntries[sortedEntries.length - 1].date);
  const daysDiff = Math.max(
    1,
    Math.round((lastDate - firstDate) / (24 * 60 * 60 * 1000))
  );
  const weeksDiff = daysDiff / 7;

  // Calculate averages
  const workoutsPerWeek = parseFloat((totalWorkouts / weeksDiff).toFixed(1));

  // Calculate streaks
  let currentStreak = 1;
  let longestStreak = 1;

  // Group by dates (just the day, not time) to handle multiple workouts in one day
  const workoutDates = new Set();
  sortedEntries.forEach((entry) => {
    const dateStr = new Date(entry.date).toISOString().split("T")[0];
    workoutDates.add(dateStr);
  });

  const uniqueDates = Array.from(workoutDates).sort();

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);

    // Calculate difference in days
    const dayDiff = (currDate - prevDate) / (24 * 60 * 60 * 1000);

    if (dayDiff === 1) {
      // Consecutive days
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Streak broken
      currentStreak = 1;
    }
  }

  return {
    frequency: {
      totalWorkouts,
      workoutsPerWeek,
      daysTracked: daysDiff,
      longestStreak,
    },
    mostRecent: sortedEntries[sortedEntries.length - 1],
  };
};

/**
 * Get comprehensive user progress with metrics
 *
 * @param {string} userId - Firebase user ID
 * @param {Object} options - Query options like date ranges
 * @returns {Promise<Object>} User progress with metrics
 */
export const getUserProgressWithMetrics = async (userId, options = {}) => {
  try {
    // Get user profile for weight goal information
    const userWithPlan = await getUserWithFitnessPlan(userId);

    if (!userWithPlan || !userWithPlan.user) {
      throw new Error("User not found");
    }

    // Get weight and workout histories
    const weightHistory = await getWeightHistory(userId, options);
    const workoutHistory = await getWorkoutHistory(userId, options);

    // Calculate metrics
    const weightMetrics = calculateWeightMetrics(
      weightHistory,
      userWithPlan.user
    );
    const workoutMetrics = calculateWorkoutMetrics(workoutHistory);

    // Return combined data
    return {
      weightData: {
        history: weightHistory,
        metrics: weightMetrics,
      },
      workoutData: {
        history: workoutHistory,
        metrics: workoutMetrics,
      },
      dateRange:
        options.startDate && options.endDate
          ? {
              startDate: options.startDate,
              endDate: options.endDate,
            }
          : "all-time",
    };
  } catch (error) {
    console.error("Error getting progress with metrics:", error);
    throw error;
  }
};
