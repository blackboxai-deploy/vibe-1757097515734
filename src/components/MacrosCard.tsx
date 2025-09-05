"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MacroData {
  current: number;
  target: number;
  percentage: number;
  remaining: number;
}

interface MacrosCardProps {
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
  isAdvancedMode?: boolean;
}

const MacroItem = ({ 
  name, 
  color, 
  current, 
  target, 
  percentage, 
  remaining,
  unit = 'g',
  calories
}: {
  name: string;
  color: string;
  current: number;
  target: number;
  percentage: number;
  remaining: number;
  unit?: string;
  calories?: number;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm font-medium text-gray-300">{name}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-white">
          {current.toFixed(1)} / {target}{unit}
        </div>
        {calories && (
          <div className="text-xs text-gray-400">
            {Math.round(calories)}kcal
          </div>
        )}
      </div>
    </div>
    
    <div className="space-y-1">
      <Progress 
        value={Math.min(percentage, 100)} 
        className="h-2"
      />
      <div className="flex justify-between text-xs">
        <span className={`font-medium ${
          percentage >= 100 ? 'text-green-400' : 'text-gray-400'
        }`}>
          {Math.round(percentage)}%
        </span>
        <span className="text-gray-500">
          {remaining > 0 ? `${remaining.toFixed(1)}${unit} restante` : 'Meta atingida'}
        </span>
      </div>
    </div>
  </div>
);

export default function MacrosCard({ protein, carbs, fat, isAdvancedMode = false }: MacrosCardProps) {
  const totalMacroCalories = (protein.current * 4) + (carbs.current * 4) + (fat.current * 9);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Macronutrientes</h3>
        {isAdvancedMode && (
          <div className="text-sm text-gray-400">
            {Math.round(totalMacroCalories)} kcal
          </div>
        )}
      </div>

      <div className="space-y-6">
        <MacroItem
          name="Proteína"
          color="bg-green-400"
          current={protein.current}
          target={protein.target}
          percentage={protein.percentage}
          remaining={protein.remaining}
          calories={isAdvancedMode ? protein.current * 4 : undefined}
        />

        <MacroItem
          name="Carboidratos"
          color="bg-blue-400"
          current={carbs.current}
          target={carbs.target}
          percentage={carbs.percentage}
          remaining={carbs.remaining}
          calories={isAdvancedMode ? carbs.current * 4 : undefined}
        />

        <MacroItem
          name="Gorduras"
          color="bg-yellow-400"
          current={fat.current}
          target={fat.target}
          percentage={fat.percentage}
          remaining={fat.remaining}
          calories={isAdvancedMode ? fat.current * 9 : undefined}
        />
      </div>

      {isAdvancedMode && (
        <div className="pt-4 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400">Proteína</div>
              <div className="text-sm font-semibold text-green-400">
                {Math.round((protein.current * 4 / totalMacroCalories) * 100) || 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Carboidratos</div>
              <div className="text-sm font-semibold text-blue-400">
                {Math.round((carbs.current * 4 / totalMacroCalories) * 100) || 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Gorduras</div>
              <div className="text-sm font-semibold text-yellow-400">
                {Math.round((fat.current * 9 / totalMacroCalories) * 100) || 0}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}