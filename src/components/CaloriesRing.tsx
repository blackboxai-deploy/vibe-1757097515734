"use client";

import React from 'react';

interface CaloriesRingProps {
  current: number;
  target: number;
  remaining: number;
  percentage: number;
}

export default function CaloriesRing({ current, target, remaining, percentage }: CaloriesRingProps) {
  // Calculate the circumference and dash offset for the progress circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
        {/* Background track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="rgba(55, 65, 81, 0.3)"
          strokeWidth="8"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#caloriesGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="caloriesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {current.toLocaleString('pt-BR')}
        </div>
        <div className="text-sm text-gray-400 mb-2">
          de {target.toLocaleString('pt-BR')} kcal
        </div>
        <div className="text-lg font-semibold text-green-400">
          {remaining > 0 ? remaining.toLocaleString('pt-BR') : '0'}
        </div>
        <div className="text-xs text-gray-500">
          {remaining > 0 ? 'restantes' : 'meta atingida'}
        </div>
      </div>

      {/* Percentage indicator */}
      <div className="absolute top-2 right-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          percentage >= 100
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : percentage >= 75
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Pulse animation when goal is reached */}
      {percentage >= 100 && (
        <div className="absolute inset-0 rounded-full bg-green-400/10 animate-pulse"></div>
      )}
    </div>
  );
}