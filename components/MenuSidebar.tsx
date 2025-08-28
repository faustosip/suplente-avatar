'use client';

import React, { useState } from 'react';
import { Coffee, Package, Star, Clock, Leaf } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface MenuCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
}

const menuData: MenuCategory[] = [
  {
    name: "Donas",
    icon: Package,
    items: [
      {
        name: "DONA GLASEADA DE CHOCOLATE",
        price: 1.09,
        description: "Dona esponjosa con rico glaseado de chocolate",
        image: "/images/dona_chocolate.png"
      },
      {
        name: "DONA RELLENA DE AREQUIPE",
        price: 1.29,
        description: "Dona clásica rellena de arequipe cremoso",
        image: "/images/dona_arequipe.png"
      },
      {
        name: "MINI DONAS SURTIDAS",
        price: 2.49,
        description: "Combo de mini donas de varios sabores",
        image: "/images/mini_donas.png"
      }
    ]
  },
  {
    name: "Bebidas",
    icon: Coffee,
    items: [
      {
        name: "CAFÉ LATINO",
        price: 1.99,
        description: "Mezcla de café de tueste medio",
        image: "/images/cafe_latino.png",
        isPopular: true
      },
      {
        name: "JUGO DE MARACUYÁ",
        price: 2.49,
        description: "Jugo natural de maracuyá",
        image: "/images/jugo_maracuya.png"
      }
    ]
  }
];

const MenuSidebar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuData[0].name);

  const currentCategory = menuData.find(cat => cat.name === selectedCategory);

  return (
    <div className="h-full flex flex-col">
      {/* Category tabs */}
      <div className="flex mb-4 bg-black/30 rounded-lg p-1">
        {menuData.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all text-sm font-medium",
                selectedCategory === category.name
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {currentCategory && (
          <div className="space-y-3">
            {currentCategory.items.map((item, index) => (
              <div
                key={index}
                className="bg-black/30 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-400/50 hover:bg-black/50 transition-all cursor-pointer group menu-item"
              >
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-white leading-tight group-hover:text-cyan-100 transition-colors">
                        {item.name}
                      </h4>
                      {item.isPopular && (
                        <span className="flex items-center text-yellow-400 text-xs ml-1 flex-shrink-0">
                          <Star className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-xs mb-2 leading-tight">
                      {item.description}
                    </p>
                    
                    <div className="text-right">
                      <span className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSidebar;