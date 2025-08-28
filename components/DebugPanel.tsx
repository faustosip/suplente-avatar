'use client';

import React, { useEffect, useState } from 'react';
import { useVapi } from '@/hooks/useVapi';
import { ConnectionStatus } from '@/types';

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  const { 
    connectionStatus, 
    error, 
    isLoading,
    orderStatus,
    vapi 
  } = useVapi();

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        connectionStatus: connectionStatus,
        error: error,
        isLoading: isLoading,
        orderStatus: orderStatus,
        vapiInstance: !!vapi,
        timestamp: new Date().toLocaleTimeString(),
        // Environment variables
        vapiKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY?.slice(0, 8) + '...',
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID?.slice(0, 8) + '...',
        simliKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY?.slice(0, 8) + '...',
        simliFaceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID?.slice(0, 8) + '...'
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    
    return () => clearInterval(interval);
  }, [connectionStatus, error, isLoading, orderStatus, vapi]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 z-50 bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        Show Debug
      </button>
    );
  }

  //return (
    // <div className="fixed top-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm border border-red-500">
    //   <div className="flex justify-between items-center mb-2">
    //     <h3 className="font-bold text-red-400">🐛 DEBUG PANEL</h3>
    //     <button
    //       onClick={() => setIsVisible(false)}
    //       className="text-red-400 hover:text-red-300"
    //     >
    //       ✕
    //     </button>
    //   </div>
      
    //   <div className="space-y-1">
    //     <div><span className="text-yellow-400">Connection:</span> {debugInfo.connectionStatus}</div>
    //     <div><span className="text-yellow-400">Loading:</span> {debugInfo.isLoading ? 'YES' : 'NO'}</div>
    //     <div><span className="text-yellow-400">Order Status:</span> {debugInfo.orderStatus}</div>
    //     <div><span className="text-yellow-400">VAPI Instance:</span> {debugInfo.vapiInstance ? 'YES' : 'NO'}</div>
    //     <div><span className="text-yellow-400">Error:</span> {debugInfo.error || 'None'}</div>
    //     <div><span className="text-yellow-400">Last Update:</span> {debugInfo.timestamp}</div>
        
    //     <hr className="border-gray-600 my-2" />
        
    //     <div className="text-gray-400">
    //       <div>VAPI Key: {debugInfo.vapiKey}</div>
    //       <div>Assistant ID: {debugInfo.assistantId}</div>
    //       <div>Simli Key: {debugInfo.simliKey}</div>
    //       <div>Face ID: {debugInfo.simliFaceId}</div>
    //     </div>
        
    //     <hr className="border-gray-600 my-2" />
        
    //     <div className="text-xs">
    //       <div className="text-green-400">ConnectionStatus enum:</div>
    //       <div>DISCONNECTED: {ConnectionStatus.DISCONNECTED}</div>
    //       <div>CONNECTING: {ConnectionStatus.CONNECTING}</div>
    //       <div>CONNECTED: {ConnectionStatus.CONNECTED}</div>
    //       <div>ERROR: {ConnectionStatus.ERROR}</div>
    //     </div>
    //   </div>
    // </div>
 // );
}