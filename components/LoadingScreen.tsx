'use client';

import React from 'react';
import { Coffee, Package } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  isVisible: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "NatalIA - Agenda tus citas con tu voz", 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative">
            <Coffee className="w-12 h-12 text-cyan-400 absolute top-0 left-0 animate-bounce" style={{ animationDelay: '0s' }} />
            <Package className="w-12 h-12 text-purple-400 absolute bottom-0 right-0 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="w-32 h-32 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mt-4"></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        Natal<span className="text-cyan-300">IA</span>
        </h1>

        {/* Loading message */}
        <p className="text-cyan-300 text-lg">{message}</p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
