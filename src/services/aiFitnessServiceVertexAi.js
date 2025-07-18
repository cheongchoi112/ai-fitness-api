import { GoogleGenAI } from "@google/genai";
import { promptInstruction } from "./constants/promptInstruction.js";
import { vertextAiResponseSchema } from "./constants/vertextAiResponseSchema.js";

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: "ai-fitness-7e94a",
  location: "global",
});
const model = "gemini-2.0-flash-lite-001";

const siText1 = {
  text: promptInstruction,
};

// Set up generation config
const generationConfig = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 1,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "OFF",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "OFF",
    },
  ],
  systemInstruction: {
    parts: [siText1],
  },
  responseMimeType: "application/json",
  responseSchema: vertextAiResponseSchema,
};

const chat = ai.chats.create({
  model: model,
  config: generationConfig,
});

async function sendMessage(message) {
  const response = await chat.sendMessageStream({
    message: message,
  });
  process.stdout.write("stream result: ");
  for await (const chunk of response) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    } else {
      process.stdout.write(JSON.stringify(chunk) + "\n");
    }
  }
}

async function generateContent(text) {
  await sendMessage([text]);
  console.log("AI fitness engine triggered!");
}

export { generateContent };
