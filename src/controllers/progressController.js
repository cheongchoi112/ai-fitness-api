/**
 * Progress Controller
 *
 * Handles HTTP requests related to progress tracking, including:
 * - Workout history management
 * - Weight history management
 *
 * As this is a prototype, implementation is kept minimal while demonstrating
 * the core functionality needed for progress tracking.
 */

import {
  addWorkoutEntry,
  updateWorkoutEntry,
  deleteWorkoutEntry,
  getWorkoutHistory,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
  getWeightHistory,
} from "../services/progressService.js";
import { getUserProgressWithMetrics } from "../services/progressMetricsService.js";

/**
 * Add a new workout completion record
 * @route POST /api/progress/workout
 */
export const addWorkout = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase user ID from auth middleware
    const workoutData = req.body;

    // Basic validation
    if (!workoutData || !workoutData.date) {
      return res.status(400).json({ error: "Workout date is required" });
    }

    const entry = await addWorkoutEntry(userId, workoutData);

    res.status(201).json({
      message: "Workout entry created successfully",
      entry,
    });
  } catch (error) {
    console.error("Error adding workout entry:", error);
    res.status(500).json({ error: "Failed to create workout entry" });
  }
};

/**
 * Update an existing workout entry
 * @route PUT /api/progress/workout/:entryId
 */
export const updateWorkout = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { entryId } = req.params;
    const workoutData = req.body;

    // Check if there's data to update
    if (Object.keys(workoutData).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    const entry = await updateWorkoutEntry(userId, entryId, workoutData);

    res.status(200).json({
      message: "Workout entry updated successfully",
      entry,
    });
  } catch (error) {
    console.error("Error updating workout entry:", error);

    // Handle specific errors
    if (error.message === "Workout entry not found") {
      return res.status(404).json({ error: "Workout entry not found" });
    }

    res.status(500).json({ error: "Failed to update workout entry" });
  }
};

/**
 * Delete a workout entry
 * @route DELETE /api/progress/workout/:entryId
 */
export const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { entryId } = req.params;

    await deleteWorkoutEntry(userId, entryId);

    res.status(200).json({
      message: "Workout entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workout entry:", error);

    // Handle specific errors
    if (error.message === "Workout entry not found") {
      return res.status(404).json({ error: "Workout entry not found" });
    }

    res.status(500).json({ error: "Failed to delete workout entry" });
  }
};

/**
 * Get user's workout history
 * @route GET /api/progress/workout-history
 */
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { startDate, endDate } = req.query;

    const options = {};
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);

    const workoutHistory = await getWorkoutHistory(userId, options);

    res.status(200).json({
      workoutHistory,
    });
  } catch (error) {
    console.error("Error getting workout history:", error);
    res.status(500).json({ error: "Failed to retrieve workout history" });
  }
};

/**
 * Add a new weight entry
 * @route POST /api/progress/weight
 */
export const addWeight = async (req, res) => {
  try {
    const userId = req.user.uid;
    const weightData = req.body;

    // Basic validation
    if (!weightData || !weightData.date || weightData.weight === undefined) {
      return res.status(400).json({ error: "Date and weight are required" });
    }

    const entry = await addWeightEntry(userId, weightData);

    res.status(201).json({
      message: "Weight entry created successfully",
      entry,
    });
  } catch (error) {
    console.error("Error adding weight entry:", error);
    res.status(500).json({ error: "Failed to create weight entry" });
  }
};

/**
 * Update an existing weight entry
 * @route PUT /api/progress/weight/:entryId
 */
export const updateWeight = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { entryId } = req.params;
    const weightData = req.body;

    // Check if there's data to update
    if (Object.keys(weightData).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    const entry = await updateWeightEntry(userId, entryId, weightData);

    res.status(200).json({
      message: "Weight entry updated successfully",
      entry,
    });
  } catch (error) {
    console.error("Error updating weight entry:", error);

    // Handle specific errors
    if (error.message === "Weight entry not found") {
      return res.status(404).json({ error: "Weight entry not found" });
    }

    res.status(500).json({ error: "Failed to update weight entry" });
  }
};

/**
 * Delete a weight entry
 * @route DELETE /api/progress/weight/:entryId
 */
export const deleteWeight = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { entryId } = req.params;

    await deleteWeightEntry(userId, entryId);

    res.status(200).json({
      message: "Weight entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting weight entry:", error);

    // Handle specific errors
    if (error.message === "Weight entry not found") {
      return res.status(404).json({ error: "Weight entry not found" });
    }

    res.status(500).json({ error: "Failed to delete weight entry" });
  }
};

/**
 * Get user's weight history
 * @route GET /api/progress/weight-history
 */
export const getWeights = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { startDate, endDate } = req.query;

    const options = {};
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);

    const weightHistory = await getWeightHistory(userId, options);

    res.status(200).json({
      weightHistory,
    });
  } catch (error) {
    console.error("Error getting weight history:", error);
    res.status(500).json({ error: "Failed to retrieve weight history" });
  }
};

/**
 * Get user's comprehensive progress data with metrics
 * @route GET /api/progress
 */
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { startDate, endDate } = req.query;

    const options = {};
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);

    const progressData = await getUserProgressWithMetrics(userId, options);

    res.status(200).json(progressData);
  } catch (error) {
    console.error("Error getting user progress:", error);

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: "Failed to retrieve progress data" });
  }
};
