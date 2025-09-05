"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Visão geral do progresso'
  },
  {
    id: 'diet',
    name: 'Dieta',
    href: '/diet',
    description: 'Planos e calculadora'
  },
  {
    id: 'evolution',
    name: 'Evolução',
    href: '/evolution',
    description: 'Gráficos e métricas'
  },
  {
    id: 'profile',
    name: 'Perfil',
    href: '/profile',
    description: 'Configurações pessoais'
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                FitNutrition
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="px-4 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                FitNutrition
              </h1>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-300"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                <div className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4">
              <div className="space-y-2">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block p-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border border-green-500/30'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-1 p-3 text-center transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-green-400'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 mx-auto mb-1 rounded-md ${
                  isActive(item.href)
                    ? 'bg-gradient-to-br from-green-400 to-blue-500'
                    : 'bg-gray-600'
                } flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Wrapper */}
      <div className="pt-16 pb-20 md:pt-16 md:pb-0">
        {/* Content will be rendered here by children */}
      </div>
    </>
  );
}