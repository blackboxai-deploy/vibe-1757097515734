"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile, calculateCalorieTarget } from '@/lib/diet-calculator';
import { NUTRITION_GOALS, ACTIVITY_LEVELS } from '@/lib/constants';

interface DietCalculatorProps {
  onProfileCalculated: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export default function DietCalculator({ onProfileCalculated, initialProfile }: DietCalculatorProps) {
  const [formData, setFormData] = useState<UserProfile>({
    age: initialProfile?.age || 25,
    weight: initialProfile?.weight || 70,
    height: initialProfile?.height || 170,
    gender: initialProfile?.gender || 'male',
    activityLevel: initialProfile?.activityLevel || 'MODERATE',
    goal: initialProfile?.goal || NUTRITION_GOALS.MAINTAIN,
    mode: initialProfile?.mode || 'beginner',
  });

  const [calculatedTarget, setCalculatedTarget] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    const target = calculateCalorieTarget(formData);
    setCalculatedTarget(target);
    setShowResults(true);
    onProfileCalculated(formData);
  };

  const getActivityLevelDescription = (level: string) => {
    const descriptions = {
      SEDENTARY: 'Pouco ou nenhum exercício',
      LIGHT: 'Exercício leve 1-3 vezes/semana',
      MODERATE: 'Exercício moderado 3-5 vezes/semana',
      ACTIVE: 'Exercício pesado 6-7 vezes/semana',
      VERY_ACTIVE: 'Exercício muito pesado, trabalho físico'
    };
    return descriptions[level as keyof typeof descriptions];
  };

  const getGoalDescription = (goal: string) => {
    const descriptions = {
      [NUTRITION_GOALS.LOSE_FAT]: 'Perder gordura corporal',
      [NUTRITION_GOALS.GAIN_MUSCLE]: 'Ganhar massa muscular',
      [NUTRITION_GOALS.MAINTAIN]: 'Manter peso atual'
    };
    return descriptions[goal];
  };

  return (
    <div className="space-y-6">
      {/* Formulário de dados */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Calculadora Personalizada de Dieta</CardTitle>
          <CardDescription className="text-gray-400">
            Insira seus dados para calcular suas necessidades calóricas e de macronutrientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-300">Idade</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-gray-300">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Gênero */}
          <div className="space-y-3">
            <Label className="text-gray-300">Gênero</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value as 'male' | 'female')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="text-gray-300">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="text-gray-300">Feminino</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Nível de atividade */}
          <div className="space-y-3">
            <Label className="text-gray-300">Nível de Atividade Física</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => handleInputChange('activityLevel', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {Object.keys(ACTIVITY_LEVELS).map((level) => (
                  <SelectItem key={level} value={level} className="text-white hover:bg-gray-700">
                    <div>
                      <div>{level.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-400">
                        {getActivityLevelDescription(level as keyof typeof ACTIVITY_LEVELS)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Objetivo */}
          <div className="space-y-3">
            <Label className="text-gray-300">Objetivo Principal</Label>
            <RadioGroup
              value={formData.goal}
              onValueChange={(value) => handleInputChange('goal', value)}
              className="space-y-3"
            >
              {Object.values(NUTRITION_GOALS).map((goal) => (
                <div key={goal} className="flex items-center space-x-3">
                  <RadioGroupItem value={goal} id={goal} />
                  <Label htmlFor={goal} className="text-gray-300 flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{getGoalDescription(goal)}</div>
                      <div className="text-sm text-gray-400">
                        {goal === NUTRITION_GOALS.LOSE_FAT && 'Déficit calórico de ~20%'}
                        {goal === NUTRITION_GOALS.GAIN_MUSCLE && 'Superávit calórico de ~15%'}
                        {goal === NUTRITION_GOALS.MAINTAIN && 'Calorias de manutenção'}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Modo */}
          <div className="space-y-3">
            <Label className="text-gray-300">Modo de Exibição</Label>
            <RadioGroup
              value={formData.mode}
              onValueChange={(value) => handleInputChange('mode', value as 'beginner' | 'advanced')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="text-gray-300">Iniciante</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="text-gray-300">Avançado</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Calcular Dieta Personalizada
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {showResults && calculatedTarget && (
        <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/30">
          <CardHeader>
            <CardTitle className="text-green-400">Seus Resultados</CardTitle>
            <CardDescription className="text-gray-300">
              Baseado nos seus dados e objetivo de {getGoalDescription(formData.goal).toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calorias principais */}
            <div className="text-center p-6 bg-gray-800/50 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">
                {calculatedTarget.dailyCalories.toLocaleString('pt-BR')}
              </div>
              <div className="text-green-400 font-medium mb-4">Calorias por dia</div>
              <div className="text-sm text-gray-400">
                Para {formData.goal === NUTRITION_GOALS.LOSE_FAT ? 'perder gordura' : 
                     formData.goal === NUTRITION_GOALS.GAIN_MUSCLE ? 'ganhar músculo' : 
                     'manter peso'}
              </div>
            </div>

            {/* Macronutrientes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {calculatedTarget.protein}g
                </div>
                <div className="text-sm text-gray-400 mb-2">Proteína</div>
                <div className="text-xs text-gray-500">
                  {calculatedTarget.proteinCalories} kcal
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {calculatedTarget.carbs}g
                </div>
                <div className="text-sm text-gray-400 mb-2">Carboidratos</div>
                <div className="text-xs text-gray-500">
                  {calculatedTarget.carbsCalories} kcal
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {calculatedTarget.fat}g
                </div>
                <div className="text-sm text-gray-400 mb-2">Gorduras</div>
                <div className="text-xs text-gray-500">
                  {calculatedTarget.fatCalories} kcal
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Recomendações Personalizadas</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Hidratação: {formData.weight * 35}ml de água por dia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Proteína por refeição: ~{Math.round(calculatedTarget.protein / 5)}g</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Refeições sugeridas: 5-6 por dia</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}