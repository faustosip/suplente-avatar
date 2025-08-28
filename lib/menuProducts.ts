// Configuración centralizada del menú - NatalIA Drive-Thru
// Este archivo define todos los productos disponibles con precios actualizados

export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  category: 'dona' | 'bebida';
  keywords: string[];
  description: string;
}

export const MENU_PRODUCTS: MenuProduct[] = [
  // =================== DONAS ===================
  {
    id: 'dona-chocolate',
    name: 'Dona glaseada de chocolate',
    price: 1.09,
    category: 'dona',
    keywords: ['dona', 'donut', 'chocolate', 'glaseada'],
    description: 'Dona esponjosa con rico glaseado de chocolate'
  },
  {
    id: 'dona-arequipe',
    name: 'Dona rellena de arequipe',
    price: 1.29,
    category: 'dona',
    keywords: ['dona', 'donut', 'arequipe', 'rellena'],
    description: 'Dona clásica rellena de arequipe cremoso'
  },
  {
    id: 'mini-donas',
    name: 'Mini donas surtidas',
    price: 2.49,
    category: 'dona',
    keywords: ['mini', 'donas', 'donuts', 'surtidas', 'combo'],
    description: 'Combo de mini donas de varios sabores'
  },

  // =================== BEBIDAS ===================
  {
    id: 'cafe-latino',
    name: 'Café latino',
    price: 1.99,
    category: 'bebida',
    keywords: ['café', 'coffee', 'latino'],
    description: 'Mezcla de café de tueste medio'
  },
  {
    id: 'jugo-maracuya',
    name: 'Jugo de maracuyá',
    price: 2.49,
    category: 'bebida',
    keywords: ['jugo', 'juice', 'maracuyá', 'maracuya'],
    description: 'Jugo natural de maracuyá'
  }
];

// Función para buscar productos por texto
export function findProductByText(text: string): MenuProduct | null {
  const lowerText = text.toLowerCase();
  
  // Buscar coincidencia exacta por keywords
  for (const product of MENU_PRODUCTS) {
    const hasAllKeywords = product.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (hasAllKeywords) {
      return product;
    }
  }
  
  return null;
}

// Función para obtener producto por ID
export function getProductById(id: string): MenuProduct | null {
  return MENU_PRODUCTS.find(product => product.id === id) || null;
}

// Función para obtener productos por categoría
export function getProductsByCategory(category: 'dona' | 'bebida'): MenuProduct[] {
  return MENU_PRODUCTS.filter(product => product.category === category);
}

// Función para formatear precio
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Función para validar orden
export function validateOrderItem(name: string, price: number): boolean {
  const product = MENU_PRODUCTS.find(p => p.name === name);
  return product ? product.price === price : false;
}
