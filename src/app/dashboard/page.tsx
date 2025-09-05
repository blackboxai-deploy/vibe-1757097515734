"use client";

import React from 'react';
import Navigation from '@/components/Navigation';
import CaloriesRing from '@/components/CaloriesRing';
import MacrosCard from '@/components/MacrosCard';
import WeeklyProgress from '@/components/WeeklyProgress';
import QuickStats from '@/components/QuickStats';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const {
    userProfile,
    calorieTarget,
    progress,
    currentMealPlan,
    waterIntake,
    addWater,
  } = useNutritionStore();

  // Mock data para demonstração - em produção viria do estado
  const mockWeekData = [
    { day: 'Segunda', shortDay: 'SEG', caloriesPercentage: 95, proteinPercentage: 88 },
    { day: 'Terça', shortDay: 'TER', caloriesPercentage: 102, proteinPercentage: 95 },
    { day: 'Quarta', shortDay: 'QUA', caloriesPercentage: 87, proteinPercentage: 82 },
    { day: 'Quinta', shortDay: 'QUI', caloriesPercentage: 93, proteinPercentage: 90 },
    { day: 'Sexta', shortDay: 'SEX', caloriesPercentage: 98, proteinPercentage: 85 },
    { day: 'Sábado', shortDay: 'SAB', caloriesPercentage: 78, proteinPercentage: 75 },
    { day: 'Domingo', shortDay: 'DOM', caloriesPercentage: progress?.calories.percentage || 0, proteinPercentage: progress?.protein.percentage || 0, isToday: true },
  ];

  const quickStats = [
    {
      label: 'Peso Atual',
      value: userProfile?.weight.toString() || '70',
      unit: 'kg',
      trend: 'down' as const,
      trendValue: '0.5kg',
      color: 'text-green-400'
    },
    {
      label: 'IMC',
      value: userProfile ? ((userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)) : '24.2',
      trend: 'neutral' as const,
      trendValue: 'Normal',
      color: 'text-blue-400'
    },
    {
      label: 'Sequência',
      value: '7',
      unit: 'dias',
      trend: 'up' as const,
      trendValue: '+1',
      color: 'text-yellow-400'
    },
    {
      label: 'Meta Semanal',
      value: '5/7',
      unit: 'dias',
      trend: 'up' as const,
      trendValue: '71%',
      color: 'text-purple-400'
    },
  ];

  if (!userProfile || !calorieTarget || !progress) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400">Carregando dados nutricionais...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Acompanhe seu progresso nutricional diário
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => addWater(250)}
              variant="outline"
              className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            >
              + 250ml Água
            </Button>
            <div className="text-right">
              <div className="text-sm text-gray-400">Hoje</div>
              <div className="text-lg font-semibold text-white">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* Principais métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Anel de calorias */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Calorias</h2>
              <div className="text-sm text-gray-400">
                Meta: {userProfile.goal.replace('_', ' ')}
              </div>
            </div>
            <CaloriesRing
              current={progress.calories.current}
              target={progress.calories.target}
              remaining={progress.calories.remaining}
              percentage={progress.calories.percentage}
            />
          </div>

          {/* Macronutrientes */}
          <div className="lg:col-span-2">
            <MacrosCard
              protein={progress.protein}
              carbs={progress.carbs}
              fat={progress.fat}
              isAdvancedMode={userProfile.mode === 'advanced'}
            />
          </div>
        </div>

        {/* Progresso semanal e estatísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyProgress weekData={mockWeekData} />
          <QuickStats
            stats={quickStats}
            waterIntake={waterIntake}
            waterTarget={userProfile.weight * 35}
          />
        </div>

        {/* Refeições do dia */}
        {currentMealPlan && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Próximas Refeições</h3>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-400 border-gray-700 hover:bg-gray-800"
              >
                Ver Plano Completo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentMealPlan.meals.slice(0, 3).map((meal, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white">{meal.name}</h4>
                      <p className="text-sm text-gray-400">{meal.time}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-400">
                        {meal.totalCalories} kcal
                      </div>
                      <div className="text-xs text-gray-500">
                        {meal.totalProtein.toFixed(0)}g proteína
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {meal.items.slice(0, 2).map((item, itemIndex) => (
                      <div key={itemIndex} className="text-xs text-gray-400 flex justify-between">
                        <span>{item.food.name}</span>
                        <span>{item.quantity}g</span>
                      </div>
                    ))}
                    {meal.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{meal.items.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas rápidas */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-white mb-2">Dica do Dia</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {userProfile.goal === 'lose_fat'
                  ? 'Para otimizar a queima de gordura, consuma sua maior refeição 3-4 horas antes do treino e mantenha um déficit calórico consistente.'
                  : userProfile.goal === 'gain_muscle'
                  ? 'Para maximizar o ganho de massa muscular, consuma 1.6-2.2g de proteína por kg de peso corporal e mantenha um superávit calórico moderado.'
                  : 'Mantenha uma alimentação equilibrada com variedade de alimentos naturais e pratique atividade física regular para manter a saúde.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}