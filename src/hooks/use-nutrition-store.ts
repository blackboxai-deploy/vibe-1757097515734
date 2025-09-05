"use client";

import { useState, useEffect } from 'react';
import { UserProfile, CalorieTarget, DailyIntake, calculateCalorieTarget, calculateProgress } from '@/lib/diet-calculator';
import { DayMealPlan, generateDayMealPlan } from '@/lib/meal-generator';
import { NUTRITION_GOALS } from '@/lib/constants';

interface NutritionStore {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // Calorie Target
  calorieTarget: CalorieTarget | null;
  
  // Daily Intake
  dailyIntake: DailyIntake;
  updateDailyIntake: (intake: Partial<DailyIntake>) => void;
  resetDailyIntake: () => void;
  
  // Meal Plan
  currentMealPlan: DayMealPlan | null;
  generateNewMealPlan: () => void;
  
  // Progress
  progress: any;
  
  // Water Intake
  waterIntake: number;
  addWater: (amount: number) => void;
  resetWater: () => void;
  
  // Favorites
  favoriteFoods: string[];
  addFavoriteFood: (foodId: string) => void;
  removeFavoriteFood: (foodId: string) => void;
  
  // History
  weightHistory: Array<{ date: string; weight: number; bodyFat?: number }>;
  addWeightEntry: (weight: number, bodyFat?: number) => void;
}

const DEFAULT_DAILY_INTAKE: DailyIntake = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
};

const DEFAULT_USER_PROFILE: UserProfile = {
  age: 25,
  weight: 70,
  height: 170,
  gender: 'male',
  activityLevel: 'MODERATE',
  goal: NUTRITION_GOALS.MAINTAIN,
  mode: 'beginner',
};

export function useNutritionStore(): NutritionStore {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>(DEFAULT_DAILY_INTAKE);
  const [currentMealPlan, setCurrentMealPlan] = useState<DayMealPlan | null>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [weightHistory, setWeightHistory] = useState<Array<{ date: string; weight: number; bodyFat?: number }>>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('nutrition-profile');
      const savedIntake = localStorage.getItem('daily-intake');
      const savedWater = localStorage.getItem('water-intake');
      const savedFavorites = localStorage.getItem('favorite-foods');
      const savedHistory = localStorage.getItem('weight-history');
      const lastResetDate = localStorage.getItem('last-reset-date');
      
      const today = new Date().toDateString();
      
      // Reset daily data if it's a new day
      if (lastResetDate !== today) {
        setDailyIntake(DEFAULT_DAILY_INTAKE);
        setWaterIntake(0);
        localStorage.setItem('last-reset-date', today);
        localStorage.removeItem('daily-intake');
        localStorage.removeItem('water-intake');
      } else {
        if (savedIntake) {
          setDailyIntake(JSON.parse(savedIntake));
        }
        if (savedWater) {
          setWaterIntake(JSON.parse(savedWater));
        }
      }
      
      if (savedProfile) {
        setUserProfileState(JSON.parse(savedProfile));
      } else {
        // Set default profile if none exists
        setUserProfileState(DEFAULT_USER_PROFILE);
      }
      
      if (savedFavorites) {
        setFavoriteFoods(JSON.parse(savedFavorites));
      }
      
      if (savedHistory) {
        setWeightHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (userProfile && typeof window !== 'undefined') {
      localStorage.setItem('nutrition-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('daily-intake', JSON.stringify(dailyIntake));
    }
  }, [dailyIntake]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('water-intake', JSON.stringify(waterIntake));
    }
  }, [waterIntake]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorite-foods', JSON.stringify(favoriteFoods));
    }
  }, [favoriteFoods]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('weight-history', JSON.stringify(weightHistory));
    }
  }, [weightHistory]);

  // Calculate calorie target when profile changes
  const calorieTarget = userProfile ? calculateCalorieTarget(userProfile) : null;

  // Calculate progress
  const progress = calorieTarget ? calculateProgress(dailyIntake, calorieTarget) : null;

  // Generate meal plan when target changes
  useEffect(() => {
    if (calorieTarget && userProfile && !currentMealPlan) {
      const mealPlan = generateDayMealPlan(calorieTarget, userProfile);
      setCurrentMealPlan(mealPlan);
    }
  }, [calorieTarget, userProfile, currentMealPlan]);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    setCurrentMealPlan(null); // Reset meal plan to regenerate
  };

  const updateDailyIntake = (intake: Partial<DailyIntake>) => {
    setDailyIntake(prev => ({
      ...prev,
      ...intake,
    }));
  };

  const resetDailyIntake = () => {
    setDailyIntake(DEFAULT_DAILY_INTAKE);
  };

  const generateNewMealPlan = () => {
    if (calorieTarget && userProfile) {
      const mealPlan = generateDayMealPlan(calorieTarget, userProfile);
      setCurrentMealPlan(mealPlan);
    }
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const addFavoriteFood = (foodId: string) => {
    setFavoriteFoods(prev => [...prev.filter(id => id !== foodId), foodId]);
  };

  const removeFavoriteFood = (foodId: string) => {
    setFavoriteFoods(prev => prev.filter(id => id !== foodId));
  };

  const addWeightEntry = (weight: number, bodyFat?: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWeightHistory(prev => [
      ...prev.filter(entry => entry.date !== today),
      { date: today, weight, bodyFat }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return {
    userProfile,
    setUserProfile,
    calorieTarget,
    dailyIntake,
    updateDailyIntake,
    resetDailyIntake,
    currentMealPlan,
    generateNewMealPlan,
    progress,
    waterIntake,
    addWater,
    resetWater,
    favoriteFoods,
    addFavoriteFood,
    removeFavoriteFood,
    weightHistory,
    addWeightEntry,
  };
}