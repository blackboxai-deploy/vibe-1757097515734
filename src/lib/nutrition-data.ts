// Banco de dados de alimentos com valores nutricionais

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number; // por 100g
  protein: number; // gramas por 100g
  carbs: number; // gramas por 100g
  fat: number; // gramas por 100g
  fiber: number; // gramas por 100g
  sugar: number; // gramas por 100g
  sodium: number; // mg por 100g
  servingSize: number; // gramas
  substitutes?: string[]; // IDs de alimentos substitutos
}

export const FOOD_DATABASE: Food[] = [
  // Proteínas
  {
    id: 'chicken_breast',
    name: 'Peito de Frango Grelhado',
    category: 'Proteína',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: 100,
    substitutes: ['turkey_breast', 'white_fish', 'tofu_firm']
  },
  {
    id: 'salmon',
    name: 'Salmão Grelhado',
    category: 'Proteína',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: 100,
    substitutes: ['tuna', 'sardines', 'mackerel']
  },
  {
    id: 'eggs',
    name: 'Ovos Inteiros',
    category: 'Proteína',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    servingSize: 100,
    substitutes: ['egg_whites', 'cottage_cheese']
  },
  {
    id: 'greek_yogurt',
    name: 'Iogurte Grego Natural',
    category: 'Proteína',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.6,
    sodium: 36,
    servingSize: 100,
    substitutes: ['cottage_cheese', 'protein_powder']
  },
  
  // Carboidratos
  {
    id: 'brown_rice',
    name: 'Arroz Integral',
    category: 'Carboidrato',
    calories: 111,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: 100,
    substitutes: ['quinoa', 'sweet_potato', 'oats']
  },
  {
    id: 'sweet_potato',
    name: 'Batata Doce',
    category: 'Carboidrato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    sodium: 6,
    servingSize: 100,
    substitutes: ['brown_rice', 'quinoa', 'oats']
  },
  {
    id: 'oats',
    name: 'Aveia em Flocos',
    category: 'Carboidrato',
    calories: 389,
    protein: 16.9,
    carbs: 66,
    fat: 6.9,
    fiber: 10.6,
    sugar: 1,
    sodium: 2,
    servingSize: 40,
    substitutes: ['quinoa', 'brown_rice', 'whole_wheat']
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Carboidrato',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    servingSize: 100,
    substitutes: ['apple', 'berries', 'dates']
  },

  // Gorduras Saudáveis
  {
    id: 'avocado',
    name: 'Abacate',
    category: 'Gordura',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    fiber: 7,
    sugar: 0.7,
    sodium: 7,
    servingSize: 100,
    substitutes: ['olive_oil', 'nuts', 'seeds']
  },
  {
    id: 'almonds',
    name: 'Amêndoas',
    category: 'Gordura',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4,
    sodium: 1,
    servingSize: 30,
    substitutes: ['walnuts', 'cashews', 'peanuts']
  },
  {
    id: 'olive_oil',
    name: 'Azeite Extra Virgem',
    category: 'Gordura',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    sugar: 0,
    sodium: 2,
    servingSize: 15,
    substitutes: ['coconut_oil', 'avocado_oil']
  },

  // Vegetais
  {
    id: 'broccoli',
    name: 'Brócolis',
    category: 'Vegetal',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    servingSize: 100,
    substitutes: ['cauliflower', 'spinach', 'kale']
  },
  {
    id: 'spinach',
    name: 'Espinafre',
    category: 'Vegetal',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sugar: 0.4,
    sodium: 79,
    servingSize: 100,
    substitutes: ['kale', 'arugula', 'lettuce']
  },
  {
    id: 'tomato',
    name: 'Tomate',
    category: 'Vegetal',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    sugar: 2.6,
    sodium: 5,
    servingSize: 100,
    substitutes: ['bell_pepper', 'cucumber', 'carrot']
  }
];

export const FOOD_CATEGORIES = [
  'Proteína',
  'Carboidrato', 
  'Gordura',
  'Vegetal',
  'Fruta',
  'Lácteo',
  'Grão',
  'Tempero'
];

export function getFoodById(id: string): Food | undefined {
  return FOOD_DATABASE.find(food => food.id === id);
}

export function getFoodsByCategory(category: string): Food[] {
  return FOOD_DATABASE.filter(food => food.category === category);
}

export function searchFoods(query: string): Food[] {
  const lowercaseQuery = query.toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
}