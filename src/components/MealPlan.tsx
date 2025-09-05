"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DayMealPlan, Meal, substituteFood } from '@/lib/meal-generator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MealPlanProps {
  mealPlan: DayMealPlan;
  onRegeneratePlan: () => void;
  onAddToFavorites?: (mealId: string) => void;
}

interface MealCardProps {
  meal: Meal;
  onSubstitute?: (mealType: string, foodId: string) => void;
}

function MealCard({ meal, onSubstitute }: MealCardProps) {
  const [substitutionDialogOpen, setSubstitutionDialogOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');

  const handleSubstitute = (foodId: string) => {
    setSelectedFoodId(foodId);
    setSubstitutionDialogOpen(true);
  };

  const confirmSubstitution = () => {
    if (onSubstitute && selectedFoodId) {
      onSubstitute(meal.type, selectedFoodId);
    }
    setSubstitutionDialogOpen(false);
    setSelectedFoodId('');
  };

  const getMealIcon = (type: string) => {
    const icons = {
      breakfast: '🌅',
      lunch: '🍽️',
      snack: '🥗',
      dinner: '🌃',
      late_snack: '🌙'
    };
    return icons[type as keyof typeof icons] || '🍽️';
  };

  const getMealTimeColor = () => {
    const currentHour = new Date().getHours();
    const mealHour = parseInt(meal.time.split(':')[0]);
    
    if (Math.abs(currentHour - mealHour) <= 1) {
      return 'border-green-500/50 bg-green-500/5';
    }
    return 'border-gray-700';
  };

  return (
    <Card className={`${getMealTimeColor()} transition-all duration-300 hover:border-gray-600`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMealIcon(meal.type)}</span>
            <div>
              <CardTitle className="text-lg text-white">{meal.name}</CardTitle>
              <p className="text-sm text-gray-400">{meal.time}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-400">{meal.totalCalories} kcal</div>
            <div className="text-xs text-gray-500">
              {meal.totalProtein.toFixed(1)}g • {meal.totalCarbs.toFixed(1)}g • {meal.totalFat.toFixed(1)}g
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Alimentos da refeição */}
        <div className="space-y-2">
          {meal.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-white text-sm">{item.food.name}</div>
                <div className="text-xs text-gray-400">
                  {item.quantity}g • {item.calories} kcal
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                  {item.food.category}
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSubstitute(item.foodId)}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  Trocar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Informações nutricionais detalhadas */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-sm font-semibold text-green-400">{meal.totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-gray-500">Proteína</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-400">{meal.totalCarbs.toFixed(1)}g</div>
              <div className="text-xs text-gray-500">Carboidratos</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-400">{meal.totalFat.toFixed(1)}g</div>
              <div className="text-xs text-gray-500">Gorduras</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{meal.totalCalories}</div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dialog de substituição */}
      <Dialog open={substitutionDialogOpen} onOpenChange={setSubstitutionDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Substituir Alimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Deseja substituir este alimento por uma opção similar?
            </p>
            
            {selectedFoodId && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-white mb-2">Alimento atual:</div>
                <div className="font-medium text-green-400">
                  {meal.items.find(item => item.foodId === selectedFoodId)?.food.name}
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSubstitutionDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmSubstitution}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirmar Substituição
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function MealPlan({ mealPlan, onRegeneratePlan, onAddToFavorites }: MealPlanProps) {
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);

  const handleSubstitution = (mealType: string, foodId: string) => {
    const substitution = substituteFood(foodId);
    if (substitution) {
      // Em uma implementação real, você atualizaria o plano de refeições
      console.log(`Substituindo ${foodId} por ${substitution.id} na refeição ${mealType}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do plano */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Plano Alimentar do Dia</h2>
            <p className="text-gray-400">
              {new Date(mealPlan.date).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long' 
              })}
            </p>
          </div>
          <Button
            onClick={onRegeneratePlan}
            variant="outline"
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 text-green-400 hover:bg-green-500/20"
          >
            Gerar Novo Plano
          </Button>
        </div>

        {/* Resumo nutricional do dia */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{mealPlan.totalCalories}</div>
            <div className="text-sm text-gray-400">Total kcal</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{mealPlan.totalProtein.toFixed(1)}g</div>
            <div className="text-sm text-gray-400">Proteína</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{mealPlan.totalCarbs.toFixed(1)}g</div>
            <div className="text-sm text-gray-400">Carboidratos</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{mealPlan.totalFat.toFixed(1)}g</div>
            <div className="text-sm text-gray-400">Gorduras</div>
          </div>
        </div>

        {/* Meta de hidratação */}
        <div className="mt-4 flex items-center justify-center space-x-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <span className="text-blue-400 text-lg">💧</span>
          <div className="text-blue-400">
            <span className="font-semibold">{mealPlan.waterTarget}ml</span> de água recomendada hoje
          </div>
        </div>
      </div>

      {/* Lista de refeições */}
      <div className="space-y-4">
        {mealPlan.meals.map((meal, index) => (
          <MealCard
            key={index}
            meal={meal}
            onSubstitute={handleSubstitution}
          />
        ))}
      </div>

      {/* Dicas do plano */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Dicas para o seu plano</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Prepare as refeições com antecedência para manter a consistência</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">✓</span>
            <span>Ajuste as porções conforme sua fome e nível de atividade</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400 mt-0.5">✓</span>
            <span>Use as substituições para variar e evitar monotonia alimentar</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 mt-0.5">✓</span>
            <span>Beba água regularmente ao longo do dia</span>
          </div>
        </div>
      </div>
    </div>
  );
}