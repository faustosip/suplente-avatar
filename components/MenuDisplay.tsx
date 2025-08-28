'use client';

import React, { useState } from 'react';
import { Coffee, Package, Star, Clock, Leaf } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface MenuCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  price: number;
  description?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isVegan?: boolean;
  prepTime?: string;
}

const menuData: MenuCategory[] = [
  {
    name: "Donas",
    icon: Package,
    items: [
      {
        name: "DONA GLASEADA CON ESPECIAS DE CALABAZA",
        price: 1.29,
        description: "Favorita de temporada con especias cálidas y glaseado suave",
        isPopular: true,
        isNew: true,
        prepTime: "2 min"
      },
      {
        name: "DONA DE PASTEL CON ESPECIAS DE CALABAZA",
        price: 1.29,
        description: "Rica dona de pastel con sabor a especias de calabaza",
        isNew: true,
        prepTime: "2 min"
      },
      {
        name: "DONA OLD FASHIONED",
        price: 1.29,
        description: "Dona clásica glaseada con exterior crujiente",
        isPopular: true,
        prepTime: "1 min"
      },
      {
        name: "DONA GLASEADA DE CHOCOLATE",
        price: 1.09,
        description: "Dona esponjosa con rico glaseado de chocolate",
        prepTime: "1 min"
      },
      {
        name: "DONA GLASEADA DE CHOCOLATE CON CHISPITAS",
        price: 1.09,
        description: "Dona glaseada de chocolate con chispitas coloridas",
        prepTime: "1 min"
      },
      {
        name: "DONA RELLENA DE FRAMBUESA",
        price: 1.09,
        description: "Relleno fresco de frambuesa en una dona suave",
        prepTime: "2 min"
      },
      {
        name: "DONA DE PASTEL DE ARÁNDANOS",
        price: 1.09,
        description: "Dona densa de pastel con trozos reales de arándanos",
        prepTime: "2 min"
      },
      {
        name: "DONA GLASEADA DE FRESA CON CHISPITAS",
        price: 1.09,
        description: "Dulce glaseado de fresa con chispitas festivas",
        prepTime: "1 min"
      },
      {
        name: "DONA RELLENA DE LIMÓN",
        price: 1.09,
        description: "Relleno brillante de limón en una dona esponjosa",
        prepTime: "2 min"
      },
      {
        name: "HOYOS DE DONA",
        price: 3.99,
        description: "Hoyos de dona del tamaño perfecto para compartir",
        prepTime: "1 min"
      }
    ]
  },
  {
    name: "Café y Bebidas",
    icon: Coffee,
    items: [
      {
        name: "CAFÉ CON ESPECIAS DE CALABAZA",
        price: 2.59,
        description: "Nuestra mezcla especial con notas de especias de calabaza",
        isPopular: true,
        isNew: true,
        prepTime: "3 min"
      },
      {
        name: "LATTE CON ESPECIAS DE CALABAZA",
        price: 4.59,
        description: "Espresso, leche vaporizada y jarabe de especias de calabaza",
        isNew: true,
        prepTime: "4 min"
      },
      {
        name: "CAFÉ AMERICANO REGULAR",
        price: 1.79,
        description: "Café recién preparado de tueste medio",
        isPopular: true,
        prepTime: "1 min"
      },
      {
        name: "CAFÉ AMERICANO DESCAFEINADO",
        price: 1.79,
        description: "Mezcla suave de café descafeinado",
        prepTime: "1 min"
      },
      {
        name: "LATTE",
        price: 3.49,
        description: "Espresso rico con leche vaporizada",
        prepTime: "3 min"
      },
      {
        name: "CAPUCHINO",
        price: 3.49,
        description: "Partes iguales de espresso, leche vaporizada y espuma",
        prepTime: "3 min"
      },
      {
        name: "MACCHIATO DE CARAMELO",
        price: 3.49,
        description: "Jarabe de vainilla, leche vaporizada, espresso y caramelo",
        prepTime: "4 min"
      },
      {
        name: "LATTE DE MOCHA",
        price: 3.49,
        description: "Chocolate y espresso con leche vaporizada",
        prepTime: "4 min"
      },
      {
        name: "LATTE DE MOCHA CON CARAMELO",
        price: 3.49,
        description: "La mezcla perfecta de caramelo, chocolate y café",
        prepTime: "4 min"
      }
    ]
  }
];

interface MenuDisplayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ isVisible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuData[0].name);

  if (!isVisible) return null;

  const currentCategory = menuData.find(cat => cat.name === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-cyan-500/30 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Menú Dr. Donut
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Category sidebar */}
          <div className="w-64 bg-black/50 border-r border-cyan-500/20 p-4">
            <div className="space-y-2">
              {menuData.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg transition-all",
                      "text-left hover:bg-cyan-500/10",
                      selectedCategory === category.name
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentCategory && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-cyan-300 mb-6">
                  {currentCategory.name}
                </h3>
                
                <div className="grid gap-4">
                  {currentCategory.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-lg font-semibold text-white">
                              {item.name}
                            </h4>
                            {item.isPopular && (
                              <span className="flex items-center text-yellow-400 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </span>
                            )}
                            {item.isNew && (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                                NEW
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="flex items-center text-green-400 text-xs">
                                <Leaf className="w-3 h-3 mr-1" />
                                Vegan
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-gray-300 text-sm mb-2">
                              {item.description}
                            </p>
                          )}
                          {item.prepTime && (
                            <div className="flex items-center text-cyan-400 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.prepTime}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-cyan-300">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Menu toggle button component
interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105",
        "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white",
        "flex items-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        className
      )}
    >
      <Package className="w-5 h-5" />
      <span>Ver Menú</span>
    </button>
  );
};
