'use client';

import React, { useState, useEffect } from 'react';
import { OrderDetailsData, OrderItem, OrderStatus } from '@/types';
import { formatCurrency, formatOrderData, cn } from '@/lib/utils';
import { ShoppingCart, Coffee, Package } from 'lucide-react';
import Image from 'next/image';

const OrderDetails: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsData>({
    items: [],
    totalAmount: 0
  });
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.NONE);
  const [isNewItemAdded, setIsNewItemAdded] = useState(false);
  const [processedOrders, setProcessedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('🛒 OrderDetails component mounted and listening for events');

    // Handle order updates from VAPI - MEJORADO Y SIMPLIFICADO
    const handleOrderUpdate = (event: CustomEvent<string>) => {
      console.log('📋 ORDER UPDATE EVENT RECEIVED:', event.detail);
      console.log('📋 Event type:', typeof event.detail);
      console.log('📋 Raw event detail:', JSON.stringify(event.detail));
      
      try {
        let orderData;
        
        // Si ya es un objeto, usarlo directamente
        if (typeof event.detail === 'object' && event.detail !== null) {
          orderData = event.detail;
        } else {
          // Si es string, parsearlo
          const parsedData = JSON.parse(event.detail);
          orderData = Array.isArray(parsedData) ? parsedData : parsedData.items || parsedData;
        }
        
        console.log('📋 Processed order data:', orderData);
        
        if (!Array.isArray(orderData)) {
          console.error('❌ Order data is not an array:', orderData);
          return;
        }
        
        if (orderData.length === 0) {
          console.log('⚠️ Empty order data received');
          return;
        }
        
        // Calcular total
        const totalAmount = orderData.reduce((sum: number, item: any) => {
          return sum + (item.price * item.quantity);
        }, 0);
        
        const formattedOrderData = {
          items: orderData,
          totalAmount: Number(totalAmount.toFixed(2))
        };
        
        console.log('📋 Setting order details:', formattedOrderData);
        
        // Actualizar estado
        setOrderDetails(formattedOrderData);
        setOrderStatus(OrderStatus.IN_PROGRESS);
        
        // Trigger animation for new item
        setIsNewItemAdded(true);
        setTimeout(() => setIsNewItemAdded(false), 1000);
        
        console.log('✅ Order details updated successfully');
        
      } catch (error) {
        console.error('❌ Error processing order update:', error);
        console.error('❌ Failed to parse:', event.detail);
      }
    };

    // Handle call ended
    const handleCallEnded = () => {
      console.log('📞 Call ended, clearing order');
      setOrderDetails({
        items: [],
        totalAmount: 0
      });
      setOrderStatus(OrderStatus.NONE);
      setProcessedOrders(new Set());
    };

    // Handle order completion
    const handleOrderCompleted = () => {
      console.log('✅ Order completed');
      setOrderStatus(OrderStatus.COMPLETED);
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      console.log('📡 Adding event listeners for order updates');
      window.addEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
      window.addEventListener('callEnded', handleCallEnded as EventListener);
      window.addEventListener('orderCompleted', handleOrderCompleted as EventListener);
      
      // NUEVO: Event listener para testing directo
      window.addEventListener('testOrderUpdate', handleOrderUpdate as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        console.log('🧹 Removing event listeners');
        window.removeEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
        window.removeEventListener('callEnded', handleCallEnded as EventListener);
        window.removeEventListener('orderCompleted', handleOrderCompleted as EventListener);
        window.removeEventListener('testOrderUpdate', handleOrderUpdate as EventListener);
      }
    };
  }, []); // Removed dependencies to avoid re-mounting

  const formatOrderItem = (item: OrderItem, index: number) => {
    const isDonut = item.name.toLowerCase().includes('doughnut') || 
                   item.name.toLowerCase().includes('donut') || 
                   item.name.toLowerCase().includes('hole') ||
                   item.name.toLowerCase().includes('dona');
    const Icon = isDonut ? Package : Coffee;
    
    return (
      <div 
        key={`${item.name}-${index}`}
        className={cn(
          "group relative mb-3 p-4 rounded-lg border transition-all duration-500",
          "bg-black/40 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-black/60",
          isNewItemAdded && index === orderDetails.items.length - 1 && 
          "animate-pulse bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={cn(
              "w-5 h-5 transition-colors duration-300",
              "text-cyan-400 group-hover:text-cyan-300",
              isNewItemAdded && index === orderDetails.items.length - 1 && "text-cyan-200"
            )} />
            <div>
              <span className="font-medium text-white text-lg">{item.quantity}x</span>
              <span className="ml-2 text-cyan-100">{item.name}</span>
            </div>
          </div>
          <span className={cn(
            "font-mono text-lg transition-colors duration-300",
            "text-cyan-300 group-hover:text-cyan-200",
            isNewItemAdded && index === orderDetails.items.length - 1 && "text-cyan-100"
          )}>
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
        
        {item.specialInstructions && (
          <div className="mt-2 text-sm text-cyan-200/70 italic pl-8">
            Note: {item.specialInstructions}
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = () => {
    switch (orderStatus) {
      case OrderStatus.IN_PROGRESS:
        return (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            In Progress ({orderDetails.items.length} items)
          </div>
        );
      case OrderStatus.COMPLETED:
        return (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Completed ✓
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Orden Actual
          </h2>
          {getStatusBadge()}
        </div>
        {/* Status indicator */}
        {orderDetails.items.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-cyan-400/70">
              In Progress ({orderDetails.items.length})
            </span>
            <span className="text-cyan-400/70">
              Desconectado
            </span>
          </div>
        )}
        <div className="mt-2 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full"></div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        <div className="space-y-2">
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => formatOrderItem(item, index))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-cyan-400/50">
              <div className="w-16 h-16 mb-4 opacity-50">
                <Image
                  src="/images/icono_carrito.png"
                  alt="Carrito vacío"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-lg font-medium text-cyan-400/70">No hay productos</p>
              <p className="text-sm mt-1 text-center text-cyan-400/50">¡Empieza pidiendo algo delicioso!</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Total */}
      {orderDetails.items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-cyan-500/30">
          <div className={cn(
            "flex justify-between items-center p-4 rounded-lg transition-all duration-500",
            orderStatus === OrderStatus.COMPLETED 
              ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              : "bg-gradient-to-r from-cyan-900/20 to-blue-900/20"
          )}>
            <span className="text-xl font-bold text-cyan-300">Total:</span>
            <span className={cn(
              "text-2xl font-mono font-bold text-transparent bg-clip-text transition-all duration-500",
              orderStatus === OrderStatus.COMPLETED
                ? "bg-gradient-to-r from-green-400 to-emerald-400"
                : "bg-gradient-to-r from-cyan-400 to-blue-400"
            )}>
              {formatCurrency(orderDetails.totalAmount)}
            </span>
          </div>
          
          {orderStatus === OrderStatus.COMPLETED && (
            <div className="mt-4 text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-green-400 font-medium">Thank you for your order!</p>
              <p className="text-green-300/70 text-sm mt-1">Please proceed to the payment window</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;