import { z } from 'zod';

export const fitnessFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  
  age: z.string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)), 'Age must be a number')
    .refine((val) => Number(val) >= 13 && Number(val) <= 120, 'Age must be between 13 and 120'),
  
  gender: z.string()
    .min(1, 'Gender is required'),
  
  height: z.string()
    .min(1, 'Height is required')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, 'Height must be a positive number')
    .refine((val) => {
      const num = Number(val);
      return num >= 50 && num <= 300;
    }, 'Height must be between 50cm and 300cm'),
  
  weight: z.string()
    .min(1, 'Weight is required')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, 'Weight must be a positive number')
    .refine((val) => {
      const num = Number(val);
      return num >= 20 && num <= 500;
    }, 'Weight must be between 20kg and 500kg'),
  
  fitnessGoal: z.string()
    .min(1, 'Fitness goal is required'),
  
  fitnessLevel: z.string()
    .min(1, 'Fitness level is required'),
  
  workoutLocation: z.string()
    .min(1, 'Workout location is required'),
  
  dietaryPreference: z.string()
    .min(1, 'Dietary preference is required'),
  
  medicalHistory: z.string()
    .max(500, 'Medical history must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  stressLevel: z.string()
    .optional()
    .or(z.literal('')),
});

export type FitnessFormData = z.infer<typeof fitnessFormSchema>;

// Validation errors type
export type ValidationErrors = Partial<Record<keyof FitnessFormData, string>>;
