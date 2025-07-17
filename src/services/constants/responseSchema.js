// Define reusable day schema
const daySchema = {
  type: "object",
  required: ["workout", "diet"],
  properties: {
    workout: {
      type: "object",
      required: ["type", "duration_minutes", "exercises"],
      properties: {
        type: {
          type: "string",
        },
        duration_minutes: {
          type: "number",
        },
        exercises: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "sets", "reps", "notes"],
            properties: {
              name: {
                type: "string",
              },
              sets: {
                type: "string",
              },
              reps: {
                type: "string",
              },
              notes: {
                type: "string",
              },
            },
          },
        },
        notes: {
          type: "string",
        },
      },
    },
    diet: {
      type: "object",
      required: ["meals_list"],
      properties: {
        daily_notes: {
          type: "string",
        },
        meals_list: {
          type: "array",
          items: {
            type: "object",
            required: ["meal_type", "description", "macronutrient_summary"],
            properties: {
              meal_type: {
                type: "string",
              },
              description: {
                type: "string",
              },
              macronutrient_summary: {
                type: "object",
                required: [
                  "estimated_calories",
                  "protein_grams",
                  "carbs_grams",
                  "fat_grams",
                ],
                properties: {
                  estimated_calories: {
                    type: "integer",
                  },
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "integer",
                  },
                  fat_grams: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const responseSchema = {
  weekly_plan: {
    type: "object",
    required: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    properties: {
      monday: daySchema,
      tuesday: daySchema,
      wednesday: daySchema,
      thursday: daySchema,
      friday: daySchema,
      saturday: daySchema,
      sunday: daySchema,
    },
  },
  general_notes: {
    type: "string",
  },
};
