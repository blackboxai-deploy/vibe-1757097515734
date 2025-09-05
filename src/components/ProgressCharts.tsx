"use client";

import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProgressChartsProps {
  weightData: Array<{ date: string; weight: number; bodyFat?: number }>;
  caloriesData: Array<{ date: string; calories: number; target: number; protein: number }>;
  isAdvancedMode?: boolean;
}

// Dados mock para demonstração
const mockWeightData = [
  { date: '01/12', weight: 72.5, bodyFat: 18.2 },
  { date: '08/12', weight: 71.8, bodyFat: 17.9 },
  { date: '15/12', weight: 71.2, bodyFat: 17.5 },
  { date: '22/12', weight: 70.8, bodyFat: 17.2 },
  { date: '29/12', weight: 70.3, bodyFat: 16.9 },
  { date: '05/01', weight: 69.9, bodyFat: 16.6 },
  { date: '12/01', weight: 69.5, bodyFat: 16.3 },
];

const mockCaloriesData = [
  { date: '12/01', calories: 1850, target: 1900, protein: 140 },
  { date: '13/01', calories: 1920, target: 1900, protein: 135 },
  { date: '14/01', calories: 1780, target: 1900, protein: 145 },
  { date: '15/01', calories: 1950, target: 1900, protein: 138 },
  { date: '16/01', calories: 1880, target: 1900, protein: 142 },
  { date: '17/01', calories: 1910, target: 1900, protein: 139 },
  { date: '18/01', calories: 1840, target: 1900, protein: 144 },
];

const macroDistributionData = [
  { name: 'Proteína', value: 30, color: '#10B981' },
  { name: 'Carboidratos', value: 40, color: '#3B82F6' },
  { name: 'Gorduras', value: 30, color: '#F59E0B' },
];

export default function ProgressCharts({ weightData, caloriesData, isAdvancedMode = false }: ProgressChartsProps) {
  const displayWeightData = weightData.length > 0 ? weightData : mockWeightData;
  const displayCaloriesData = caloriesData.length > 0 ? caloriesData : mockCaloriesData;

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}{entry.name.includes('Peso') ? 'kg' : 
                              entry.name.includes('Gordura') ? '%' : 
                              entry.name.includes('calorias') || entry.name.includes('target') ? ' kcal' : 
                              entry.name.includes('Proteína') ? 'g' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Peso e Gordura Corporal */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Evolução do Peso</h3>
            <p className="text-gray-400 text-sm">Últimas 7 semanas</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-400">Peso (kg)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-gray-400">Gordura (%)</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayWeightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#10B981"
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#3B82F6"
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="weight" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Peso"
              />
              {isAdvancedMode && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  name="Gordura Corporal"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo da evolução */}
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {displayWeightData.length > 1 ? 
                (displayWeightData[displayWeightData.length - 1].weight - displayWeightData[0].weight).toFixed(1) : 
                '0'
              }kg
            </div>
            <div className="text-xs text-gray-400">Variação total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">
              {displayWeightData.length > 1 ? 
                Math.abs((displayWeightData[displayWeightData.length - 1].bodyFat || 0) - (displayWeightData[0].bodyFat || 0)).toFixed(1) : 
                '0'
              }%
            </div>
            <div className="text-xs text-gray-400">Gordura perdida</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">7</div>
            <div className="text-xs text-gray-400">Semanas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">
              {displayWeightData.length > 1 ? 
                (((displayWeightData[displayWeightData.length - 1].weight - displayWeightData[0].weight) / displayWeightData.length) * -1).toFixed(2) : 
                '0'
              }kg
            </div>
            <div className="text-xs text-gray-400">Por semana</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Calorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Aderência Calórica</h3>
              <p className="text-gray-400 text-sm">Últimos 7 dias</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayCaloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="target" 
                  fill="#6B7280" 
                  name="Meta"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="calories" 
                  fill="#10B981" 
                  name="Consumidas"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400 mb-2">Média semanal</div>
            <div className="text-xl font-bold text-green-400">
              {Math.round(displayCaloriesData.reduce((acc, day) => acc + day.calories, 0) / displayCaloriesData.length)} kcal
            </div>
          </div>
        </div>

        {/* Distribuição de Macros */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Distribuição de Macros</h3>
              <p className="text-gray-400 text-sm">Média atual</p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {macroDistributionData.map((macro, index) => (
              <div key={index}>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  ></div>
                  <span className="text-sm text-gray-400">{macro.name}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: macro.color }}>
                  {macro.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Proteína (modo avançado) */}
      {isAdvancedMode && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Consumo de Proteína</h3>
              <p className="text-gray-400 text-sm">Evolução diária</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayCaloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="protein"
                  stroke="#10B981"
                  fill="url(#proteinGradient)"
                  strokeWidth={2}
                  name="Proteína"
                />
                <defs>
                  <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}