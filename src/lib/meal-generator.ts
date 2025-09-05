// Gerador de planos alimentares diários

import { FOOD_DATABASE, Food, getFoodById } from './nutrition-data';
import { CalorieTarget, UserProfile } from './diet-calculator';
import { MEAL_TYPES } from './constants';

export interface MealItem {
  foodId: string;
  food: Food;
  quantity: number; // em gramas
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  type: typeof MEAL_TYPES[number];
  name: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  time: string;
}

export interface DayMealPlan {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterTarget: number;
}

// Distribuição calórica por refeição
const MEAL_CALORIE_DISTRIBUTION = {
  breakfast: 0.25, // 25%
  lunch: 0.35,     // 35%
  snack: 0.10,     // 10%
  dinner: 0.25,    // 25%
  late_snack: 0.05 // 5%
};

// Horários das refeições
const MEAL_TIMES = {
  breakfast: '07:00',
  lunch: '12:00',
  snack: '15:00',
  dinner: '19:00',
  late_snack: '21:00'
};

// Nomes das refeições
const MEAL_NAMES = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar',
  late_snack: 'Ceia'
};

// Calcula os valores nutricionais de um alimento baseado na quantidade
function calculateFoodNutrition(food: Food, quantity: number): Omit<MealItem, 'foodId' | 'food'> {
  const multiplier = quantity / 100; // alimentos são por 100g
  
  return {
    quantity,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
  };
}

// Seleciona alimentos baseado em categoria e disponibilidade
function selectFoodsByCategory(category: string, exclude: string[] = []): Food[] {
  return FOOD_DATABASE
    .filter(food => food.category === category && !exclude.includes(food.id))
    .sort(() => Math.random() - 0.5); // embaralha
}

// Gera uma refeição específica
function generateMeal(
  mealType: typeof MEAL_TYPES[number],
  targetCalories: number,
  _profile: UserProfile
): Meal {
  const items: MealItem[] = [];
  let currentCalories = 0;
  
  // Estratégias por tipo de refeição
  switch (mealType) {
    case 'breakfast':
      // Café da manhã: Proteína + Carboidrato + Gordura
      const proteinFoods = selectFoodsByCategory('Proteína');
      const carbFoods = selectFoodsByCategory('Carboidrato');
      const fatFoods = selectFoodsByCategory('Gordura');
      
      if (proteinFoods.length > 0) {
        const protein = proteinFoods[0];
        const quantity = Math.round(targetCalories * 0.4 / protein.calories * 100);
        const nutrition = calculateFoodNutrition(protein, quantity);
        items.push({
          foodId: protein.id,
          food: protein,
          ...nutrition
        });
        currentCalories += nutrition.calories;
      }
      
      if (carbFoods.length > 0) {
        const carb = carbFoods.find(f => f.id === 'oats') || carbFoods[0];
        const remainingCalories = targetCalories - currentCalories;
        const quantity = Math.round(remainingCalories * 0.6 / carb.calories * 100);
        const nutrition = calculateFoodNutrition(carb, Math.min(quantity, 50));
        items.push({
          foodId: carb.id,
          food: carb,
          ...nutrition
        });
        currentCalories += nutrition.calories;
      }
      
      if (fatFoods.length > 0 && currentCalories < targetCalories * 0.9) {
        const fat = fatFoods[0];
        const quantity = Math.min(15, fat.servingSize);
        const nutrition = calculateFoodNutrition(fat, quantity);
        items.push({
          foodId: fat.id,
          food: fat,
          ...nutrition
        });
      }
      break;

    case 'lunch':
    case 'dinner':
      // Almoço/Jantar: Proteína principal + Carboidrato + Vegetais
      const mealProteins = selectFoodsByCategory('Proteína');
      const mealCarbs = selectFoodsByCategory('Carboidrato');
      const vegetables = selectFoodsByCategory('Vegetal');
      
      // Proteína principal (40% das calorias)
      if (mealProteins.length > 0) {
        const protein = mealProteins[0];
        const quantity = Math.round(targetCalories * 0.4 / protein.calories * 100);
        const nutrition = calculateFoodNutrition(protein, Math.min(quantity, 200));
        items.push({
          foodId: protein.id,
          food: protein,
          ...nutrition
        });
        currentCalories += nutrition.calories;
      }
      
      // Carboidrato (35% das calorias)
      if (mealCarbs.length > 0) {
        const carb = mealCarbs[0];
        const remainingCalories = targetCalories - currentCalories;
        const quantity = Math.round(remainingCalories * 0.6 / carb.calories * 100);
        const nutrition = calculateFoodNutrition(carb, Math.min(quantity, 150));
        items.push({
          foodId: carb.id,
          food: carb,
          ...nutrition
        });
        currentCalories += nutrition.calories;
      }
      
      // Vegetais (baixa caloria, alto volume)
      if (vegetables.length > 0) {
        const veggie = vegetables[0];
        const nutrition = calculateFoodNutrition(veggie, 100);
        items.push({
          foodId: veggie.id,
          food: veggie,
          ...nutrition
        });
      }
      break;

    case 'snack':
      // Lanche: Fruta + Proteína leve ou Gordura saudável
      const snackProteins = selectFoodsByCategory('Proteína').filter(f => 
        f.id === 'greek_yogurt' || f.id === 'cottage_cheese'
      );
      const fruits = selectFoodsByCategory('Carboidrato').filter(f => 
        f.id === 'banana' || f.name.includes('Maçã') || f.name.includes('Berry')
      );
      
      if (fruits.length > 0) {
        const fruit = fruits[0] || getFoodById('banana');
        if (fruit) {
          const nutrition = calculateFoodNutrition(fruit, 100);
          items.push({
            foodId: fruit.id,
            food: fruit,
            ...nutrition
          });
          currentCalories += nutrition.calories;
        }
      }
      
      if (snackProteins.length > 0 && currentCalories < targetCalories * 0.7) {
        const protein = snackProteins[0];
        const quantity = Math.round((targetCalories - currentCalories) / protein.calories * 100);
        const nutrition = calculateFoodNutrition(protein, Math.min(quantity, 150));
        items.push({
          foodId: protein.id,
          food: protein,
          ...nutrition
        });
      }
      break;

    case 'late_snack':
      // Ceia: Proteína lenta (caseína) ou pequeno lanche
      const nightProteins = selectFoodsByCategory('Proteína').filter(f => 
        f.id === 'greek_yogurt' || f.id === 'cottage_cheese'
      );
      
      if (nightProteins.length > 0) {
        const protein = nightProteins[0];
        const quantity = Math.round(targetCalories / protein.calories * 100);
        const nutrition = calculateFoodNutrition(protein, Math.min(quantity, 100));
        items.push({
          foodId: protein.id,
          food: protein,
          ...nutrition
        });
      }
      break;
  }

  // Calcula totais da refeição
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = items.reduce((sum, item) => sum + item.fat, 0);

  return {
    type: mealType,
    name: MEAL_NAMES[mealType],
    items,
    totalCalories,
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    time: MEAL_TIMES[mealType],
  };
}

// Gera um plano alimentar completo para o dia
export function generateDayMealPlan(
  target: CalorieTarget,
  profile: UserProfile,
  date: string = new Date().toISOString().split('T')[0]
): DayMealPlan {
  const meals: Meal[] = [];

  // Gera cada refeição
  for (const mealType of MEAL_TYPES) {
    const mealCalories = Math.round(target.dailyCalories * MEAL_CALORIE_DISTRIBUTION[mealType]);
    const meal = generateMeal(mealType, mealCalories, profile);
    meals.push(meal);
  }

  // Calcula totais do dia
  const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.totalFat, 0);

  return {
    date,
    meals,
    totalCalories,
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    waterTarget: profile.weight * 35, // 35ml por kg
  };
}

// Substitui um alimento por outro similar
export function substituteFood(currentFoodId: string, _preferredCategory?: string): Food | null {
  const currentFood = getFoodById(currentFoodId);
  if (!currentFood) return null;

  const substitutes = currentFood.substitutes?.map(id => getFoodById(id)).filter(Boolean) || [];
  
  if (substitutes.length > 0) {
    return substitutes[Math.floor(Math.random() * substitutes.length)] as Food;
  }

  // Se não há substitutos definidos, busca por categoria
  const sameCategoryFoods = selectFoodsByCategory(currentFood.category, [currentFoodId]);
  if (sameCategoryFoods.length > 0) {
    return sameCategoryFoods[0];
  }

  return null;
}

// Ajusta uma refeição para atingir calorias específicas
export function adjustMealCalories(meal: Meal, targetCalories: number): Meal {
  const currentCalories = meal.totalCalories;
  const ratio = targetCalories / currentCalories;
  
  const adjustedItems = meal.items.map(item => {
    const newQuantity = Math.round(item.quantity * ratio);
    const nutrition = calculateFoodNutrition(item.food, newQuantity);
    
    return {
      ...item,
      ...nutrition
    };
  });

  const totalCalories = adjustedItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = adjustedItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = adjustedItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = adjustedItems.reduce((sum, item) => sum + item.fat, 0);

  return {
    ...meal,
    items: adjustedItems,
    totalCalories,
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
  };
}