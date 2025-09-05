// Calculadora de dieta personalizada

import { ACTIVITY_LEVELS, NUTRITION_GOALS, MACRO_RATIOS } from './constants';

export interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  activityLevel: keyof typeof ACTIVITY_LEVELS;
  goal: keyof typeof NUTRITION_GOALS;
  mode: 'beginner' | 'advanced';
}

export interface CalorieTarget {
  dailyCalories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fat: number; // gramas
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}

export interface DailyIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Fórmula de Harris-Benedict revisada para calcular TMB (Taxa Metabólica Basal)
function calculateBMR(profile: UserProfile): number {
  const { age, weight, height, gender } = profile;
  
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

// Calcula TDEE (Total Daily Energy Expenditure)
function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultiplier = ACTIVITY_LEVELS[profile.activityLevel];
  return bmr * activityMultiplier;
}

// Calcula as calorias alvo baseado no objetivo
export function calculateCalorieTarget(profile: UserProfile): CalorieTarget {
  const tdee = calculateTDEE(profile);
  
  let dailyCalories: number;
  
  switch (profile.goal) {
    case NUTRITION_GOALS.LOSE_FAT:
      dailyCalories = Math.round(tdee * 0.8); // Déficit de 20%
      break;
    case NUTRITION_GOALS.GAIN_MUSCLE:
      dailyCalories = Math.round(tdee * 1.15); // Superávit de 15%
      break;
    case NUTRITION_GOALS.MAINTAIN:
    default:
      dailyCalories = Math.round(tdee);
      break;
  }

  const macroRatios = MACRO_RATIOS[profile.goal];
  
  // Calcular macros em calorias
  const proteinCalories = dailyCalories * macroRatios.protein;
  const carbsCalories = dailyCalories * macroRatios.carbs;
  const fatCalories = dailyCalories * macroRatios.fat;
  
  // Converter para gramas (1g proteína = 4kcal, 1g carbs = 4kcal, 1g fat = 9kcal)
  const protein = Math.round(proteinCalories / 4);
  const carbs = Math.round(carbsCalories / 4);
  const fat = Math.round(fatCalories / 9);

  return {
    dailyCalories,
    protein,
    carbs,
    fat,
    proteinCalories: Math.round(proteinCalories),
    carbsCalories: Math.round(carbsCalories),
    fatCalories: Math.round(fatCalories),
  };
}

// Calcula o progresso atual vs meta
export function calculateProgress(current: DailyIntake, target: CalorieTarget) {
  return {
    calories: {
      current: current.calories,
      target: target.dailyCalories,
      percentage: Math.min((current.calories / target.dailyCalories) * 100, 100),
      remaining: Math.max(target.dailyCalories - current.calories, 0),
    },
    protein: {
      current: current.protein,
      target: target.protein,
      percentage: Math.min((current.protein / target.protein) * 100, 100),
      remaining: Math.max(target.protein - current.protein, 0),
    },
    carbs: {
      current: current.carbs,
      target: target.carbs,
      percentage: Math.min((current.carbs / target.carbs) * 100, 100),
      remaining: Math.max(target.carbs - current.carbs, 0),
    },
    fat: {
      current: current.fat,
      target: target.fat,
      percentage: Math.min((current.fat / target.fat) * 100, 100),
      remaining: Math.max(target.fat - current.fat, 0),
    },
  };
}

// Sugere ajustes na dieta baseado no progresso
export function suggestAdjustments(profile: UserProfile, progress: any) {
  const suggestions: string[] = [];

  if (progress.protein.percentage < 80) {
    suggestions.push('Adicione uma fonte de proteína magra como frango, peixe ou ovos');
  }

  if (progress.carbs.percentage > 120 && profile.goal === NUTRITION_GOALS.LOSE_FAT) {
    suggestions.push('Reduza carboidratos simples e prefira fontes complexas como batata doce');
  }

  if (progress.fat.percentage < 70) {
    suggestions.push('Inclua gorduras saudáveis como abacate, castanhas ou azeite');
  }

  if (progress.calories.percentage < 70) {
    suggestions.push('Você está comendo pouco! Adicione mais refeições saudáveis');
  }

  if (progress.calories.percentage > 110) {
    suggestions.push('Cuidado com as porções. Tente reduzir o tamanho das refeições');
  }

  return suggestions;
}

// Calcula as necessidades hídricas
export function calculateWaterIntake(profile: UserProfile): number {
  // Fórmula: 35ml por kg de peso corporal + 500ml adicional se muito ativo
  const baseWater = profile.weight * 35;
  const activityBonus = profile.activityLevel === 'VERY_ACTIVE' ? 500 : 0;
  
  return Math.round(baseWater + activityBonus);
}