"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DietCalculator from '@/components/DietCalculator';
import MealPlan from '@/components/MealPlan';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DietPage() {
  const {
    userProfile,
    setUserProfile,
    calorieTarget,
    currentMealPlan,
    generateNewMealPlan,
    addFavoriteFood,
  } = useNutritionStore();

  const [activeTab, setActiveTab] = useState('calculator');

  const handleProfileCalculated = (profile: any) => {
    setUserProfile(profile);
    setActiveTab('meal-plan');
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Configure Sua Dieta</h1>
            <p className="text-gray-400">
              Primeiro, vamos calcular suas necessidades nutricionais personalizadas
            </p>
          </div>
          <DietCalculator
            onProfileCalculated={handleProfileCalculated}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dieta Personalizada</h1>
          <p className="text-gray-400">
            Sua calculadora de dieta e planos alimentares baseados no seu perfil
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
            <TabsTrigger 
              value="calculator" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Calculadora
            </TabsTrigger>
            <TabsTrigger 
              value="meal-plan"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              Plano Alimentar
            </TabsTrigger>
            <TabsTrigger 
              value="food-database"
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400"
            >
              Banco de Alimentos
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Favoritos
            </TabsTrigger>
          </TabsList>

          {/* Calculadora */}
          <TabsContent value="calculator" className="space-y-6">
            <DietCalculator
              onProfileCalculated={handleProfileCalculated}
              initialProfile={userProfile}
            />
          </TabsContent>

          {/* Plano alimentar */}
          <TabsContent value="meal-plan" className="space-y-6">
            {calorieTarget && currentMealPlan ? (
              <MealPlan
                mealPlan={currentMealPlan}
                onRegeneratePlan={generateNewMealPlan}
                onAddToFavorites={addFavoriteFood}
              />
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Gerando Plano Alimentar...</CardTitle>
                  <CardDescription className="text-gray-400">
                    Aguarde enquanto criamos seu plano personalizado
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Criando refeições balanceadas...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Banco de alimentos */}
          <TabsContent value="food-database" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Banco de Alimentos</CardTitle>
                <CardDescription className="text-gray-400">
                  Explore nossa base de alimentos com informações nutricionais completas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🥗</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Em Desenvolvimento</h3>
                  <p className="text-gray-400 mb-4">
                    Estamos preparando uma interface completa para explorar nosso banco de alimentos
                  </p>
                  <div className="text-sm text-gray-500">
                    Por enquanto, você pode ver os alimentos nos seus planos de refeição
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favoritos */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Refeições Favoritas</CardTitle>
                <CardDescription className="text-gray-400">
                  Salve suas refeições preferidas para reutilizar nos próximos planos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum Favorito Ainda</h3>
                  <p className="text-gray-400 mb-4">
                    Adicione refeições aos favoritos pelos seus planos alimentares
                  </p>
                  <Button
                    onClick={() => setActiveTab('meal-plan')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Ver Planos de Refeição
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resumo do perfil atual */}
        {userProfile && calorieTarget && (
          <Card className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Seu Perfil Nutricional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-400">{calorieTarget.dailyCalories}</div>
                  <div className="text-sm text-gray-400">Calorias/dia</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">{calorieTarget.protein}g</div>
                  <div className="text-sm text-gray-400">Proteína</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">{calorieTarget.carbs}g</div>
                  <div className="text-sm text-gray-400">Carboidratos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-400">{calorieTarget.fat}g</div>
                  <div className="text-sm text-gray-400">Gorduras</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400">{userProfile.weight * 35}ml</div>
                  <div className="text-sm text-gray-400">Água/dia</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}