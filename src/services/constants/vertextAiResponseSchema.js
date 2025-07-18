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
