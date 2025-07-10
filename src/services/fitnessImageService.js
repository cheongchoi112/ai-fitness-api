/**
 * Fitness Plan Image Enhancement Service
 *
 * This service adds images to workout exercises and meal descriptions in fitness plans.
 * Images are generated using Gemini AI and added as base64 strings directly in the plan.
 *
 * As this is a prototype, implementation is kept minimal while demonstrating the core functionality.
 */

import { generateImage } from "./aiImageGeneratorGemini.js";

/**
 * Enhance a fitness plan with AI-generated images for exercises and meals
 *
 * @param {Object} fitnessPlan - The fitness plan object to enhance with images
 * @param {Object} [options] - Configuration options for image generation
 * @param {boolean} [options.generateImages=true] - Flag to enable/disable image generation
 * @param {string} [options.exerciseImageStyle="Photorealistic, professional fitness demonstration with proper form on neutral background"] - Style instruction for exercise images
 * @param {string} [options.foodImageStyle="Photorealistic, appetizing food photography with natural lighting on white plate"] - Style instruction for food images
 * @param {number} [options.maxConcurrent=5] - Maximum number of concurrent image generation requests
 * @param {Object} [options.imageOptions={ width: 400, height: 400 }] - Image size and quality options
 * @returns {Promise<Object>} - The enhanced fitness plan with images
 */
export const enhanceFitnessPlanWithImages = async (
  fitnessPlan,
  {
    generateImages = true,
    exerciseImageStyle = "Photorealistic, professional fitness demonstration with proper form on neutral background",
    foodImageStyle = "Photorealistic, appetizing food photography with natural lighting on white plate",
    maxConcurrent = 5,
    imageOptions = { width: 400, height: 400 },
  } = {}
) => {
  // If image generation is disabled, return the original plan
  if (!generateImages) {
    console.log(
      "Image generation is disabled. Returning original fitness plan."
    );
    return fitnessPlan;
  }

  console.log("Enhancing fitness plan with AI-generated images...");
  const startTime = Date.now();

  try {
    // Clone the fitness plan to avoid modifying the original
    const enhancedPlan = JSON.parse(JSON.stringify(fitnessPlan));

    // Collect all items that need images
    const imageRequests = [];

    // Extract workout exercises that need images
    if (enhancedPlan.weekly_plan) {
      // Weekly plan is an object with days as properties, not an array
      Object.keys(enhancedPlan.weekly_plan).forEach((dayKey) => {
        const day = enhancedPlan.weekly_plan[dayKey];
        if (day.workout && day.workout.exercises) {
          for (const exercise of day.workout.exercises) {
            if (exercise.name) {
              imageRequests.push({
                type: "exercise",
                item: exercise,
                prompt: `Exercise demonstration of ${exercise.name}`,
              });
            }
          }
        }
      });
    }

    // Extract meal descriptions that need images
    if (enhancedPlan.weekly_plan) {
      // Weekly plan is an object with days as properties, not an array
      Object.keys(enhancedPlan.weekly_plan).forEach((dayKey) => {
        const day = enhancedPlan.weekly_plan[dayKey];
        if (day.diet && day.diet.meals_list) {
          for (const meal of day.diet.meals_list) {
            if (meal.description) {
              imageRequests.push({
                type: "meal",
                item: meal,
                prompt: `Food photograph of ${meal.description}`,
              });
            }
          }
        }
      });
    }

    console.log(`Found ${imageRequests.length} items that need images`);

    // Process image requests in batches to control concurrency
    const results = {
      total: imageRequests.length,
      successful: 0,
      failed: 0,
      timeMs: 0,
    };

    // Process batches of requests
    for (let i = 0; i < imageRequests.length; i += maxConcurrent) {
      const batch = imageRequests.slice(i, i + maxConcurrent);
      console.log(
        `Processing batch ${Math.floor(i / maxConcurrent) + 1} of ${Math.ceil(
          imageRequests.length / maxConcurrent
        )} (${batch.length} items)`
      );

      // Process batch in parallel
      const batchPromises = batch.map(async (request) => {
        try {
          console.log(
            `Generating image for ${request.type}: ${request.prompt.substring(
              0,
              50
            )}...`
          );
          // Select style based on content type
          const styleInstruction =
            request.type === "exercise" ? exerciseImageStyle : foodImageStyle;

          const imageBase64 = await generateImage(
            request.prompt,
            styleInstruction,
            imageOptions
          );

          // Add the image to the item
          if (imageBase64) {
            request.item.imageBase64 = imageBase64;
            results.successful++;
            return { success: true };
          } else {
            console.warn(
              `No image data returned for ${
                request.type
              }: ${request.prompt.substring(0, 30)}...`
            );
            results.failed++;
            return { success: false, error: "No image data returned" };
          }
        } catch (error) {
          console.error(
            `Error generating image for ${
              request.type
            }: ${request.prompt.substring(0, 30)}...`,
            error
          );
          results.failed++;
          return { success: false, error: error.message };
        }
      });

      // Wait for all promises in the batch to complete
      await Promise.all(batchPromises);
    }

    const endTime = Date.now();
    results.timeMs = endTime - startTime;

    console.log("Image generation completed:");
    console.log(`- Total items: ${results.total}`);
    console.log(`- Successful: ${results.successful}`);
    console.log(`- Failed: ${results.failed}`);
    console.log(`- Time taken: ${results.timeMs / 1000} seconds`);

    return enhancedPlan;
  } catch (error) {
    console.error("Error enhancing fitness plan with images:", error);
    // Return original plan if enhancement fails
    return fitnessPlan;
  }
};
