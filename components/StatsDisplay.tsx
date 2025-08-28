'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Users, Coffee, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeCustomers: number;
  averageOrderTime: number;
  popularItems: { name: string; count: number }[];
}

export const StatsDisplay: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeCustomers: 0,
    averageOrderTime: 0,
    popularItems: []
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for order completions and update stats - FIXED: Handle null/undefined event.detail
    const handleOrderCompleted = (event: CustomEvent) => {
      try {
        console.log('📊 StatsDisplay: Order completion event received:', event.detail);
        
        // Check if event.detail exists and is not null
        if (!event.detail) {
          console.warn('⚠️ StatsDisplay: event.detail is null or undefined, skipping stats update');
          return;
        }
        
        let orderData;
        
        // Handle different types of event.detail
        if (typeof event.detail === 'string') {
          try {
            orderData = JSON.parse(event.detail);
          } catch (parseError) {
            console.error('❌ StatsDisplay: Failed to parse event.detail as JSON:', parseError);
            return;
          }
        } else if (Array.isArray(event.detail)) {
          orderData = event.detail;
        } else if (typeof event.detail === 'object' && event.detail.items) {
          // If event.detail is an object with items property
          orderData = event.detail.items;
        } else {
          console.warn('⚠️ StatsDisplay: Unexpected event.detail format:', typeof event.detail, event.detail);
          return;
        }
        
        // Verify orderData is an array
        if (!Array.isArray(orderData)) {
          console.warn('⚠️ StatsDisplay: orderData is not an array:', orderData);
          return;
        }
        
        // Calculate order total safely
        const orderTotal = orderData.reduce((sum: number, item: any) => {
          // Safely access item properties
          const price = typeof item.price === 'number' ? item.price : 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
          return sum + (price * quantity);
        }, 0);

        console.log('📊 StatsDisplay: Calculated order total:', orderTotal);

        // Update popular items
        const newPopularItems = [...stats.popularItems];
        orderData.forEach((item: any) => {
          if (item.name) {
            const existingItem = newPopularItems.find(pi => pi.name === item.name);
            if (existingItem) {
              existingItem.count += item.quantity || 1;
            } else {
              newPopularItems.push({ name: item.name, count: item.quantity || 1 });
            }
          }
        });

        // Sort popular items by count
        newPopularItems.sort((a, b) => b.count - a.count);

        setStats(prevStats => {
          const newTotalOrders = prevStats.totalOrders + 1;
          const newTotalRevenue = prevStats.totalRevenue + orderTotal;
          const newAverageOrderValue = newTotalRevenue / newTotalOrders;
          
          return {
            ...prevStats,
            totalOrders: newTotalOrders,
            totalRevenue: Number(newTotalRevenue.toFixed(2)),
            averageOrderValue: Number(newAverageOrderValue.toFixed(2)),
            popularItems: newPopularItems.slice(0, 10) // Keep top 10
          };
        });
        
        console.log('✅ StatsDisplay: Stats updated successfully');
        
      } catch (error) {
        console.error('❌ StatsDisplay: Error updating stats:', error);
      }
    };

    const handleActiveCustomerChange = (event: CustomEvent) => {
      try {
        if (event.detail && typeof event.detail.count === 'number') {
          setStats(prevStats => ({
            ...prevStats,
            activeCustomers: event.detail.count
          }));
        }
      } catch (error) {
        console.error('❌ StatsDisplay: Error updating active customers:', error);
      }
    };

    // IMPROVED: Listen to orderDetailsUpdated instead of orderCompleted for real-time stats
    const handleOrderDetailsUpdated = (event: CustomEvent) => {
      try {
        console.log('📊 StatsDisplay: Order details updated for stats tracking');
        // Don't process individual item updates for stats, only completed orders
      } catch (error) {
        console.error('❌ StatsDisplay: Error handling order details update:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('orderCompleted', handleOrderCompleted as EventListener);
      window.addEventListener('activeCustomersChanged', handleActiveCustomerChange as EventListener);
      window.addEventListener('orderDetailsUpdated', handleOrderDetailsUpdated as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('orderCompleted', handleOrderCompleted as EventListener);
        window.removeEventListener('activeCustomersChanged', handleActiveCustomerChange as EventListener);
        window.removeEventListener('orderDetailsUpdated', handleOrderDetailsUpdated as EventListener);
      }
    };
  }, [stats.popularItems]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-3 rounded-full border border-cyan-500/30 transition-all z-30"
      >
        <TrendingUp className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-cyan-500/30 rounded-xl p-4 w-80 z-30 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyan-400">Live Stats</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Orders</span>
            </div>
            <p className="text-xl font-bold text-white">{stats.totalOrders}</p>
          </div>

          <div className="bg-black/40 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Revenue</span>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          <div className="bg-black/40 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Avg Order</span>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(stats.averageOrderValue)}</p>
          </div>

          <div className="bg-black/40 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Active</span>
            </div>
            <p className="text-xl font-bold text-white">{stats.activeCustomers}</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Avg Order Time</span>
          </div>
          <p className="text-lg font-bold text-white">{stats.averageOrderTime.toFixed(1)}s</p>
        </div>

        {stats.popularItems.length > 0 && (
          <div className="bg-black/40 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Coffee className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Popular Items</span>
            </div>
            <div className="space-y-1">
              {stats.popularItems.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-300 truncate">{item.name}</span>
                  <span className="text-cyan-400">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
