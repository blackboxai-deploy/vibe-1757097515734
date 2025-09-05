"use client";

import React from 'react';

interface DayProgress {
  day: string;
  shortDay: string;
  caloriesPercentage: number;
  proteinPercentage: number;
  isToday?: boolean;
}

interface WeeklyProgressProps {
  weekData: DayProgress[];
}

export default function WeeklyProgress({ weekData }: WeeklyProgressProps) {
  const maxHeight = 60; // altura máxima das barras em pixels

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Progresso Semanal</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-gray-400">Calorias</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-gray-400">Proteína</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between space-x-2 h-20">
        {weekData.map((day, index) => {
          const caloriesHeight = Math.min((day.caloriesPercentage / 100) * maxHeight, maxHeight);
          const proteinHeight = Math.min((day.proteinPercentage / 100) * maxHeight, maxHeight);
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              {/* Barras de progresso */}
              <div className="relative w-full flex items-end justify-center space-x-1" style={{ height: `${maxHeight}px` }}>
                {/* Barra de calorias */}
                <div className="flex flex-col items-center justify-end flex-1">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 delay-100 ${
                      day.caloriesPercentage >= 100
                        ? 'bg-green-400'
                        : day.caloriesPercentage >= 75
                        ? 'bg-yellow-400'
                        : 'bg-green-400/60'
                    }`}
                    style={{ height: `${caloriesHeight}px` }}
                  ></div>
                </div>
                
                {/* Barra de proteína */}
                <div className="flex flex-col items-center justify-end flex-1">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 delay-200 ${
                      day.proteinPercentage >= 100
                        ? 'bg-blue-400'
                        : day.proteinPercentage >= 75
                        ? 'bg-blue-400/80'
                        : 'bg-blue-400/60'
                    }`}
                    style={{ height: `${proteinHeight}px` }}
                  ></div>
                </div>
              </div>

              {/* Dia da semana */}
              <div className="text-center">
                <div className={`text-xs font-medium ${
                  day.isToday
                    ? 'text-green-400'
                    : 'text-gray-400'
                }`}>
                  {day.shortDay}
                </div>
                {day.isToday && (
                  <div className="w-1 h-1 bg-green-400 rounded-full mx-auto mt-1"></div>
                )}
              </div>

              {/* Percentagens (mostrar apenas no dia atual ou no hover) */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 pointer-events-none transition-opacity ${
                day.isToday ? 'opacity-100' : ''
              } group-hover:opacity-100`}>
                <div className="text-green-400">{Math.round(day.caloriesPercentage)}%</div>
                <div className="text-blue-400">{Math.round(day.proteinPercentage)}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo semanal */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-semibold text-white">
              {weekData.filter(d => d.caloriesPercentage >= 100).length}
            </div>
            <div className="text-xs text-gray-400">Dias completos</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-green-400">
              {Math.round(weekData.reduce((acc, d) => acc + d.caloriesPercentage, 0) / weekData.length)}%
            </div>
            <div className="text-xs text-gray-400">Média calorias</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-400">
              {Math.round(weekData.reduce((acc, d) => acc + d.proteinPercentage, 0) / weekData.length)}%
            </div>
            <div className="text-xs text-gray-400">Média proteína</div>
          </div>
        </div>
      </div>
    </div>
  );
}