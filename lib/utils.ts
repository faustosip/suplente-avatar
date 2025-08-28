import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatOrderData(orderDetailsData: string) {
  try {
    const parsedItems = JSON.parse(orderDetailsData);
    const totalAmount = parsedItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    return {
      items: parsedItems,
      totalAmount: Number(totalAmount.toFixed(2))
    };
  } catch (error) {
    console.error('Error parsing order data:', error);
    return {
      items: [],
      totalAmount: 0
    };
  }
}
