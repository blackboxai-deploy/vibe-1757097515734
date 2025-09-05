"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/lib/diet-calculator';
import { NUTRITION_GOALS, ACTIVITY_LEVELS } from '@/lib/constants';

export default function ProfilePage() {
  const {
    userProfile,
    setUserProfile,
    calorieTarget,
    resetDailyIntake,
    resetWater,
  } = useNutritionStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(userProfile);
  const [notifications, setNotifications] = useState({
    meals: true,
    water: true,
    exercise: false,
    weight: true,
  });

  if (!userProfile || !formData) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
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

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (formData) {
      setFormData(prev => prev ? {
        ...prev,
        [field]: value
      } : null);
    }
  };

  const handleSave = () => {
    if (formData) {
      setUserProfile(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  const getGoalBadgeColor = (goal: string) => {
    switch (goal) {
      case NUTRITION_GOALS.LOSE_FAT:
        return 'text-green-400 border-green-400';
      case NUTRITION_GOALS.GAIN_MUSCLE:
        return 'text-blue-400 border-blue-400';
      default:
        return 'text-yellow-400 border-yellow-400';
    }
  };

  const getGoalName = (goal: string) => {
    switch (goal) {
      case NUTRITION_GOALS.LOSE_FAT:
        return 'Perder Gordura';
      case NUTRITION_GOALS.GAIN_MUSCLE:
        return 'Ganhar Músculo';
      default:
        return 'Manter Peso';
    }
  };

  const getActivityName = (level: string) => {
    const names = {
      SEDENTARY: 'Sedentário',
      LIGHT: 'Leve',
      MODERATE: 'Moderado',
      ACTIVE: 'Ativo',
      VERY_ACTIVE: 'Muito Ativo'
    };
    return names[level as keyof typeof names] || level;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Perfil</h1>
            <p className="text-gray-400 mt-1">
              Gerencie suas informações pessoais e configurações
            </p>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Editar Perfil
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Salvar
              </Button>
            </div>
          )}
        </div>

        {/* Resumo do perfil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userProfile.gender === 'male' ? '👨' : '👩'}
                </span>
              </div>
              <CardTitle className="text-white">Perfil Atual</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div>
                <div className="text-2xl font-bold text-green-400">{userProfile.weight}kg</div>
                <div className="text-sm text-gray-400">Peso</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-400">{userProfile.height}cm</div>
                <div className="text-sm text-gray-400">Altura</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-400">{userProfile.age} anos</div>
                <div className="text-sm text-gray-400">Idade</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Objetivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className={`${getGoalBadgeColor(userProfile.goal)} bg-transparent text-center w-full py-2`}>
                {getGoalName(userProfile.goal)}
              </Badge>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Nível de Atividade</div>
                <div className="font-medium text-white">
                  {getActivityName(userProfile.activityLevel)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Modo</div>
                <Badge className="text-purple-400 border-purple-400 bg-transparent">
                  {userProfile.mode === 'advanced' ? 'Avançado' : 'Iniciante'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Metas Diárias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {calorieTarget && (
                <>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">{calorieTarget.dailyCalories}</div>
                    <div className="text-xs text-gray-400">Calorias</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="font-semibold text-green-400">{calorieTarget.protein}g</div>
                      <div className="text-gray-400">Proteína</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-400">{calorieTarget.carbs}g</div>
                      <div className="text-gray-400">Carbos</div>
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-400">{calorieTarget.fat}g</div>
                      <div className="text-gray-400">Gorduras</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Formulário de edição */}
        {isEditing && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Editar Informações</CardTitle>
              <CardDescription className="text-gray-400">
                Atualize suas informações pessoais e recalcule suas metas
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
                <Label className="text-gray-300">Nível de Atividade</Label>
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
                        {getActivityName(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Objetivo */}
              <div className="space-y-3">
                <Label className="text-gray-300">Objetivo</Label>
                <RadioGroup
                  value={formData.goal}
                  onValueChange={(value) => handleInputChange('goal', value)}
                  className="space-y-2"
                >
                  {Object.values(NUTRITION_GOALS).map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <RadioGroupItem value={goal} id={goal} />
                      <Label htmlFor={goal} className="text-gray-300">
                        {getGoalName(goal)}
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
            </CardContent>
          </Card>
        )}

        {/* Configurações de notificações */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Notificações</CardTitle>
            <CardDescription className="text-gray-400">
              Configure seus lembretes e notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Lembretes de Refeições</div>
                <div className="text-sm text-gray-400">Receba lembretes nos horários das refeições</div>
              </div>
              <Switch
                checked={notifications.meals}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, meals: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Lembretes de Hidratação</div>
                <div className="text-sm text-gray-400">Lembrete para beber água a cada 30 minutos</div>
              </div>
              <Switch
                checked={notifications.water}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, water: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Lembretes de Exercício</div>
                <div className="text-sm text-gray-400">Motivação para atividade física</div>
              </div>
              <Switch
                checked={notifications.exercise}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, exercise: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Lembretes de Pesagem</div>
                <div className="text-sm text-gray-400">Lembrete semanal para registrar peso</div>
              </div>
              <Switch
                checked={notifications.weight}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weight: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações de dados */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Gerenciar Dados</CardTitle>
            <CardDescription className="text-gray-400">
              Ações para resetar ou exportar seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={resetDailyIntake}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                Resetar Dados do Dia
              </Button>
              
              <Button
                onClick={resetWater}
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                Resetar Hidratação
              </Button>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-400 mb-3">
                Ações permanentes (não podem ser desfeitas):
              </div>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Resetar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações do app */}
        <div className="text-center text-sm text-gray-500">
          <div className="mb-2">FitNutrition v1.0.0</div>
          <div>Seus dados são armazenados localmente no seu dispositivo</div>
        </div>
      </div>
    </div>
  );
}