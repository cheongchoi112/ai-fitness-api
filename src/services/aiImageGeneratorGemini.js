import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Generate an image using Google's Gemini AI based on a text prompt
 *
 * @param {string} content - The text prompt for image generation
 * @param {string} [styleInstruction] - Instructions for styling the image consistently
 * @param {Object} [options] - Additional options
 * @param {number} [options.width] - Width to resize the image to (keeps aspect ratio if only width is specified)
 * @param {number} [options.height] - Height to resize the image to (keeps aspect ratio if only height is specified)
 * @param {number} [options.quality=90] - JPEG/PNG quality (1-100)
 * @returns {Promise<string>} - Base64 encoded image data
 */
export const generateImage = async (
  content,
  styleInstruction = "",
  options = {}
) => {
  try {
    // Initialize Google Gemini AI with API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Combine content and style instruction if provided
    const promptContent = styleInstruction
      ? `${content}. Style: ${styleInstruction}`
      : content;

    // Generate the image
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: promptContent,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageData = null;
    let description = null;

    // Process the response
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        description = part.text;
      } else if (part.inlineData) {
        imageData = part.inlineData.data;
      }
    }

    // Process the image if needed
    if (imageData) {
      // Only process if resize options are provided
      if (options.width || options.height) {
        let buffer = Buffer.from(imageData, "base64");
        let resizeOptions = {};

        if (options.width) resizeOptions.width = options.width;
        if (options.height) resizeOptions.height = options.height;

        // Create Sharp instance for resizing
        let sharpImage = sharp(buffer);
        sharpImage = sharpImage.resize(resizeOptions);

        // Apply quality if specified
        if (options.quality) {
          sharpImage = sharpImage.png({
            quality: options.quality,
          });
        }

        // Process the image and update base64
        buffer = await sharpImage.toBuffer();
        imageData = buffer.toString("base64");
      }
    }

    // Just return the base64 data
    return imageData;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
