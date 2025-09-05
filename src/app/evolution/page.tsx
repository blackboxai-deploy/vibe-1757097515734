"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProgressCharts from '@/components/ProgressCharts';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function EvolutionPage() {
  const {
    userProfile,
    weightHistory,
    addWeightEntry,
  } = useNutritionStore();

  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddWeight = () => {
    if (newWeight && parseFloat(newWeight) > 0) {
      const weight = parseFloat(newWeight);
      const bodyFat = newBodyFat ? parseFloat(newBodyFat) : undefined;
      
      addWeightEntry(weight, bodyFat);
      setNewWeight('');
      setNewBodyFat('');
      setIsDialogOpen(false);
    }
  };

  // Calcular estatísticas
  const currentWeight = weightHistory.length > 0 ? weightHistory[0].weight : userProfile?.weight || 70;
  const initialWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 1].weight : currentWeight;
  const weightChange = currentWeight - initialWeight;
  const currentBodyFat = weightHistory.length > 0 ? weightHistory[0].bodyFat : undefined;

  // Mock data para calorias (em uma implementação real viria do estado)
  const mockCaloriesData = [
    { date: '12/01', calories: 1850, target: 1900, protein: 140 },
    { date: '13/01', calories: 1920, target: 1900, protein: 135 },
    { date: '14/01', calories: 1780, target: 1900, protein: 145 },
    { date: '15/01', calories: 1950, target: 1900, protein: 138 },
    { date: '16/01', calories: 1880, target: 1900, protein: 142 },
    { date: '17/01', calories: 1910, target: 1900, protein: 139 },
    { date: '18/01', calories: 1840, target: 1900, protein: 144 },
  ];

  // Calcular IMC
  const calculateBMI = (weight: number, height: number) => {
    return weight / ((height / 100) ** 2);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-400' };
    return { category: 'Obesidade', color: 'text-red-400' };
  };

  const currentBMI = userProfile ? calculateBMI(currentWeight, userProfile.height) : 0;
  const bmiInfo = getBMICategory(currentBMI);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Configure Seu Perfil</h1>
            <p className="text-gray-400 mb-6">
              Você precisa configurar seu perfil na seção de Dieta primeiro
            </p>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              Ir para Dieta
            </Button>
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
            <h1 className="text-3xl font-bold text-white">Evolução</h1>
            <p className="text-gray-400 mt-1">
              Acompanhe seu progresso e evolução ao longo do tempo
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Adicionar Peso
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Medição</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="70.5"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bodyFat" className="text-gray-300">
                    Gordura Corporal % (opcional)
                  </Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                    placeholder="15.5"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddWeight}
                    disabled={!newWeight}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cartões de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Peso Atual */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Peso Atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{currentWeight.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">kg</div>
                </div>
                {weightChange !== 0 && (
                  <div className={`text-sm font-medium ${weightChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* IMC */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Índice de Massa Corporal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{currentBMI.toFixed(1)}</div>
                <Badge className={`${bmiInfo.color} bg-transparent border-current`}>
                  {bmiInfo.category}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Gordura Corporal */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Gordura Corporal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentBodyFat ? (
                  <>
                    <div className="text-2xl font-bold text-white">{currentBodyFat.toFixed(1)}</div>
                    <div className="text-sm text-gray-400">%</div>
                  </>
                ) : (
                  <>
                    <div className="text-lg text-gray-400">--</div>
                    <div className="text-xs text-gray-500">Não medido</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Objetivo */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Objetivo Atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-white">
                  {userProfile.goal === 'lose_fat' ? 'Perder Gordura' :
                   userProfile.goal === 'gain_muscle' ? 'Ganhar Músculo' :
                   'Manter Peso'}
                </div>
                <Badge className={`${
                  userProfile.goal === 'lose_fat' ? 'text-green-400 border-green-400' :
                  userProfile.goal === 'gain_muscle' ? 'text-blue-400 border-blue-400' :
                  'text-yellow-400 border-yellow-400'
                } bg-transparent`}>
                  {userProfile.mode === 'advanced' ? 'Avançado' : 'Iniciante'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de evolução */}
        <ProgressCharts
          weightData={weightHistory.slice().reverse()}
          caloriesData={mockCaloriesData}
          isAdvancedMode={userProfile.mode === 'advanced'}
        />

        {/* Histórico de medições */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Medições</CardTitle>
            <CardDescription className="text-gray-400">
              Suas últimas medições registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weightHistory.length > 0 ? (
              <div className="space-y-3">
                {weightHistory.slice(0, 10).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="font-medium text-white">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-400">
                        Peso: {entry.weight}kg
                        {entry.bodyFat && ` • Gordura: ${entry.bodyFat}%`}
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <Badge className="text-green-400 border-green-400 bg-transparent">
                        Atual
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum registro ainda</h3>
                <p className="text-gray-400 mb-4">
                  Adicione seu primeiro registro de peso para começar a acompanhar sua evolução
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Adicionar Primeiro Registro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dicas de acompanhamento */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Dicas para Melhor Acompanhamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-0.5">⚖️</span>
              <span>Pese-se sempre no mesmo horário, preferencialmente pela manhã</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 mt-0.5">📅</span>
              <span>Registre medições semanalmente para acompanhar tendências</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-400 mt-0.5">📏</span>
              <span>Combine medições de peso com circunferências corporais</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-400 mt-0.5">📈</span>
              <span>Foque em tendências de longo prazo, não flutuações diárias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}