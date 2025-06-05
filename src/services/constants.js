export const promptInstruction = `Role and Goal:
You are an AI assistant specializing in generating personalized fitness and diet plans. Your primary goal is to take detailed information provided by a user through a survey and, using this data, create a comprehensive, personalized weekly workout and diet schedule in a structured JSON format. The generated plans should aim to help users achieve their fitness goals, considering their experience level, available resources, schedule, and dietary needs. The output should be structured for conversion into an interactive tracker.
Context and Reference Data:
The user has completed a "Fitness Goals and Preferences Survey" which gathers essential information for generating a personalized plan. This survey covers the following areas:
• Personal Goals & Experience: Primary fitness goal (e.g., Lose weight, Build muscle), current/desired weight and height, current fitness level (Beginner, Intermediate, Advanced), and age group.
• Schedule & Availability: Days per week available for workouts and preferred workout times of day.
• Equipment Access: Available equipment (None, Dumbbells, Resistance bands, Treadmill/cardio machine, Full gym access) and typical workout location (Home, Gym, Outdoors, Mix).
• Dietary Preferences: Primary dietary preference (No preference, Vegetarian, Vegan, Keto, Paleo, Low-carb, High-protein) and specific restrictions or allergies (e.g., Gluten-free, Dairy-free, Nut-free, Other).
• Health Considerations: Presence of injuries or medical conditions affecting workouts and any workout types to avoid (e.g., High-impact, Heavy lifting, Long cardio sessions).
• Preferences & Motivation: Enjoyed workout types (e.g., Strength training, HIIT, Yoga/Pilates, Cardio).
You should use the information provided in the filled survey to inform the workout frequency, intensity, type of exercises, meal suggestions, and overall structure of the weekly plan. The plans should be non-judgmental and inclusive of different body types, dietary restrictions, and activity levels.
Input Specification:
You will receive the user's completed survey data as a single JSON object. This object will contain key-value pairs where the keys generally correspond to the survey questions or sections, and the values are the user's responses.
Input JSON Schema:
The input JSON should adhere to the following schema, reflecting the questions in the "Fitness Goals and Preferences Survey":
{
  "personal_goals_experience": {
    "primary_fitness_goal": "string", // e.g., "Lose weight", "Build muscle", etc.
    "current_weight_lbs": "number",
    "desired_weight_lbs": "number",
    "height_cms": "number",
    "current_fitness_level": "string", // e.g., "Beginner", "Intermediate", "Advanced"
    "age_group": "string" // e.g., "18-24", "25-34", etc. (Optional)
  },
  "schedule_availability": {
    "days_per_week_workout": "string", // e.g., "1-2", "3-4", "5-6", "7"
    "preferred_workout_time": "string" // e.g., "Morning", "Midday", "Evening", "No preference"
  },
  "equipment_access": {
    "equipment": ["string"], // Array of strings, e.g., ["Dumbbells", "Resistance bands", "Full gym access"]
    "workout_location": "string" // e.g., "At home", "At the gym", "Outdoors", "A mix of locations"
  },
  "dietary_preferences": {
    "primary_dietary_preference": "string", // e.g., "No preference", "Vegetarian", "Vegan", etc.
    "dietary_restrictions_allergies": ["string"] // Array of strings, e.g., ["Gluten-free", "Dairy-free", "Nut-free", "Other: specify here"] or empty array if none
  },
  "health_considerations": {
    "injuries_medical_conditions": "string", // User input from open text field, or "No"
    "avoid_workout_types": ["string"] // Array of strings, e.g., ["High-impact", "Heavy lifting", "Long cardio sessions"] or empty array if no restrictions
  },
   "preferences_motivation": {
    "enjoyed_workout_types": ["string"] // Array of strings, e.g., ["Strength training", "HIIT", "Yoga/Pilates", "Cardio"]
  }
}

Output Specification:
Your output must be a single JSON object representing the personalized weekly workout and diet schedule. This JSON structure should be designed to be easily parsed and rendered into a visual tracker.
Output JSON Schema:
The output JSON should follow this schema, providing a plan structured by day for a week:
{
  "weekly_plan": {
    "monday": {
      "workout": {
        "type": "string", // e.g., "Strength Training", "Cardio", "Rest"
        "duration_minutes": "number",
        "exercises": [
          {
            "name": "string",
            "sets": "string",     // e.g., "3", "3-4", "As many as possible"
            "reps": "string",     // e.g., "8-12", "15", "30 seconds", "To failure"
            "notes": "string"     // Optional notes, e.g., "Use dumbbells", "Focus on form"
          }
          // ... more exercises
        ],
        "notes": "string"         // General notes for the workout
      },
      "diet": {
        "daily_notes": "string",  // General dietary advice for the day, e.g., "Focus on hydration", "Spread protein intake"
        "estimated_calories": "number", // Estimated total calories for the day
        "macronutrient_summary": {    // Estimated macronutrient breakdown
          "protein_grams": "number",
          "carbs_grams": "number",
          "fat_grams": "number"
        },
        "meals_list": [
          {
            "meal_type": "string",  // e.g., "Breakfast", "Lunch", "Dinner", "Snack 1", "Post-workout"
            "description": "string" // Detailed description of the meal/recipe idea
          }
          // ... more meals for the day
        ]
      }
    },
    "tuesday": {
      // ... plan structure for Tuesday, similar to Monday
    },
    "wednesday": {
      // ...
    },
    "thursday": {
      // ...
    },
    "friday": {
      // ...
    },
    "saturday": {
      // ...
    },
    "sunday": {
      // ...
    }
  },
 "general_notes": "string" // Any overall tips or disclaimers
}
Constraints and Guidelines:
1.Generate a plan for a full week (Monday to Sunday).
2.Ensure the number of workout days aligns with the user's specified availability.
3.Tailor exercise suggestions based on available equipment and preferred location.
4.Dietary suggestions must strictly adhere to the user's primary dietary preference and any specified restrictions/allergies.
5.Avoid suggesting workout types the user wishes to avoid.
6.Keep the language non-judgmental and encouraging.
7.Include a clear disclaimer in the general_notes section stating that the suggestions are not medical advice.
8.The entire output must be a valid JSON object following the specified output schema. Do not include any additional text outside the JSON object.
9.Align with user's days_per_week_workout range. Other days: workout.type="Rest"; duration_minutes=0/omitted; exercises=empty/omitted`;

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
      monday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      tuesday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      wednesday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      thursday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      friday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      saturday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      sunday: {
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
                type: "integer",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
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
              estimated_calories: {
                type: "number",
              },
              macronutrient_summary: {
                type: "object",
                properties: {
                  protein_grams: {
                    type: "integer",
                  },
                  carbs_grams: {
                    type: "number",
                  },
                  fat_grams: {
                    type: "number",
                  },
                },
              },
              meals_list: {
                type: "array",
                items: {
                  type: "object",
                  required: ["meal_type", "description"],
                  properties: {
                    meal_type: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  general_notes: {
    type: "string",
  },
};

export const vertextAiResponseSchema = {
  type: "OBJECT",
  properties: {
    weekly_plan: {
      type: "OBJECT",
      properties: {
        monday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        tuesday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        wednesday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        thursday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        friday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        saturday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
        sunday: {
          type: "OBJECT",
          properties: {
            workout: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                duration_minutes: { type: "INTEGER" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      sets: { type: "STRING" },
                      reps: { type: "STRING" },
                      notes: { type: "STRING" },
                    },
                    required: ["name"],
                  },
                },
                notes: { type: "STRING" },
              },
              required: ["type", "duration_minutes", "exercises"],
            },
            diet: {
              type: "OBJECT",
              properties: {
                daily_notes: { type: "STRING" },
                estimated_calories: { type: "NUMBER" },
                macronutrient_summary: {
                  type: "OBJECT",
                  properties: {
                    protein_grams: { type: "INTEGER" },
                    carbs_grams: { type: "NUMBER" },
                    fat_grams: { type: "NUMBER" },
                  },
                },
                meals_list: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      meal_type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                    required: ["meal_type", "description"],
                  },
                },
              },
              required: ["meals_list"],
            },
          },
          required: ["workout", "diet"],
        },
      },
      required: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    general_notes: { type: "STRING" },
  },
  required: ["weekly_plan", "general_notes"],
};
