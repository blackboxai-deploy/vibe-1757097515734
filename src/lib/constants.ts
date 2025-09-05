// Constantes da aplicação de nutrição

export const THEME_COLORS = {
  primary: {
    green: '#10B981', // green-500
    greenLight: '#34D399', // green-400  
    blue: '#3B82F6', // blue-500
    blueLight: '#60A5FA', // blue-400
  },
  background: {
    primary: '#030712', // gray-950
    secondary: '#111827', // gray-900
    tertiary: '#1F2937', // gray-800
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB', // gray-300
    muted: '#9CA3AF', // gray-400
  }
};

export const NUTRITION_GOALS = {
  LOSE_FAT: 'lose_fat',
  GAIN_MUSCLE: 'gain_muscle',
  MAINTAIN: 'maintain',
} as const;

export const ACTIVITY_LEVELS = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
} as const;

export const MACRO_RATIOS = {
  [NUTRITION_GOALS.LOSE_FAT]: {
    protein: 0.4,
    carbs: 0.3,
    fat: 0.3,
  },
  [NUTRITION_GOALS.GAIN_MUSCLE]: {
    protein: 0.3,
    carbs: 0.4,
    fat: 0.3,
  },
  [NUTRITION_GOALS.MAINTAIN]: {
    protein: 0.25,
    carbs: 0.45,
    fat: 0.3,
  },
};

export const MEAL_TYPES = [
  'breakfast',
  'lunch', 
  'snack',
  'dinner',
  'late_snack',
] as const;

export const USER_MODES = {
  BEGINNER: 'beginner',
  ADVANCED: 'advanced',
} as const;