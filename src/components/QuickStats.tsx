"use client";

import React from 'react';

interface StatItem {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
  waterIntake: number;
  waterTarget: number;
}

export default function QuickStats({ stats, waterIntake, waterTarget }: QuickStatsProps) {
  const waterPercentage = Math.min((waterIntake / waterTarget) * 100, 100);

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estatísticas principais */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className={`text-lg font-semibold ${stat.color || 'text-white'}`}>
                  {stat.value}
                  {stat.unit && <span className="text-sm text-gray-400 ml-1">{stat.unit}</span>}
                </div>
              </div>
              {stat.trend && stat.trendValue && (
                <div className={`text-sm font-medium ${getTrendColor(stat.trend)} flex items-center space-x-1`}>
                  <span>{getTrendIcon(stat.trend)}</span>
                  <span>{stat.trendValue}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidratação */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Hidratação</h3>
          <div className="text-sm text-gray-400">
            {waterIntake}ml de {waterTarget}ml
          </div>
        </div>

        {/* Barra de progresso da água */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${waterPercentage}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow">
                {Math.round(waterPercentage)}%
              </span>
            </div>
          </div>

          {/* Copos de água visual */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 8 }, (_, i) => {
              const cupTarget = (waterTarget / 8) * (i + 1);
              const isFilled = waterIntake >= cupTarget;
              
              return (
                <div
                  key={i}
                  className={`w-6 h-8 border-2 border-gray-600 rounded-b-lg rounded-t-sm transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-t from-blue-500 to-cyan-400 border-blue-400'
                      : 'bg-transparent'
                  }`}
                ></div>
              );
            })}
          </div>

          {/* Status da hidratação */}
          <div className="text-center">
            <div className={`text-sm font-medium ${
              waterPercentage >= 100
                ? 'text-green-400'
                : waterPercentage >= 75
                ? 'text-blue-400'
                : waterPercentage >= 50
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {waterPercentage >= 100
                ? 'Meta de hidratação atingida! 💧'
                : waterPercentage >= 75
                ? 'Bem hidratado!'
                : waterPercentage >= 50
                ? 'Continue bebendo água'
                : 'Precisa beber mais água'
              }
            </div>
          </div>

          {/* Lembrete inteligente */}
          {waterPercentage < 100 && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-400">
                  Próximo copo em {Math.max(30 - Math.floor(Date.now() / 60000) % 30, 0)} min
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}