'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { ConnectionStatus, VapiConfig, OrderDetailsData } from '@/types';

// Event dispatcher for notifications
const dispatchNotification = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('addNotification', {
      detail: { type, title, message, duration: 5000 }
    }));
  }
};

// Helper function para acumular productos en el carrito (SOLO desde updateOrder)
const addToCart = (newItems: Array<{name: string, quantity: number, price: number}>) => {
  if (typeof window === 'undefined') return;
  
  // Inicializar carrito si no existe
  if (!window.currentOrder) {
    window.currentOrder = [];
  }
  
  console.log('🛒 Current cart before adding:', window.currentOrder);
  console.log('🛒 Items to add from updateOrder:', newItems);
  
  // Agregar items al carrito
  for (const newItem of newItems) {
    const existingItemIndex = window.currentOrder.findIndex(
      item => item.name === newItem.name && item.price === newItem.price
    );
    
    if (existingItemIndex >= 0) {
      // Si ya existe, SETEAR la cantidad (no incrementar) porque updateOrder ya maneja las cantidades correctas
      window.currentOrder[existingItemIndex].quantity = newItem.quantity;
      console.log(`🔄 Updated existing item: ${newItem.name} (quantity: ${newItem.quantity})`);
    } else {
      // Si no existe, agregar nuevo item
      window.currentOrder.push({...newItem});
      console.log(`➕ Added new item to cart: ${newItem.name} ($${newItem.price})`);
    }
  }
  
  console.log('🛒 Updated cart:', window.currentOrder);
  
  // Dispatch el carrito completo
  console.log('📡 DISPATCHING complete cart update');
  window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
    detail: JSON.stringify(window.currentOrder)
  }));
  
  return window.currentOrder;
};

// Helper function para limpiar el carrito
const clearCart = () => {
  if (typeof window !== 'undefined') {
    window.currentOrder = [];
    console.log('🗑️ Cart cleared');
  }
};

// Extend window interface para el carrito únicamente
declare global {
  interface Window {
    currentOrder?: Array<{name: string, quantity: number, price: number}>;
  }
}

export function useVapi() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'none' | 'in-progress' | 'completed'>('none');
  
  const vapiRef = useRef<Vapi | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize VAPI
  const initializeVapi = useCallback(() => {
    if (isInitializedRef.current) {
      console.log('⚠️ VAPI already initialized, skipping...');
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    console.log('🔧 VAPI Initialization Debug:', {
      publicKey: publicKey ? `${publicKey.slice(0, 8)}...` : 'MISSING',
      assistantId: assistantId ? `${assistantId.slice(0, 8)}...` : 'MISSING',
      nodeEnv: process.env.NODE_ENV,
      hasWindow: typeof window !== 'undefined'
    });

    if (!publicKey || !assistantId) {
      const errorMsg = `Missing VAPI configuration. PublicKey: ${!!publicKey}, AssistantId: ${!!assistantId}`;
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      console.log('🚀 Initializing VAPI with valid credentials...');
      
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;
      isInitializedRef.current = true;

      console.log('✅ VAPI instance created successfully');

      // VAPI Event Listeners
      vapi.on('call-start', () => {
        console.log('✅ VAPI: Call started');
        setConnectionStatus(ConnectionStatus.CONNECTED);
        setError(null);
        setIsLoading(false);
        
        // Reset cart for new call
        clearCart();
        
        dispatchNotification('success', 'Connected!', 'Voice AI is ready to take your order');
      });

      vapi.on('call-end', () => {
        console.log('📞 VAPI: Call ended');
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        setOrderStatus('none');
        
        // Clean cart on call end
        clearCart();
        
        // Dispatch event for UI components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('callEnded'));
        }
        dispatchNotification('info', 'Call Ended', 'Thank you for visiting NatalIA!');
      });

      vapi.on('error', (error: any) => {
        console.error('❌ VAPI Error:', error);
        setError(error.message || 'Unknown VAPI error occurred');
        setConnectionStatus(ConnectionStatus.ERROR);
        setIsLoading(false);
        dispatchNotification('error', 'Connection Error', error.message || 'Please try again');
      });

      vapi.on('speech-start', () => {
        console.log('🗣️ VAPI: User started speaking');
      });

      vapi.on('speech-end', () => {
        console.log('🔇 VAPI: User stopped speaking');
      });

      // HANDLER PRINCIPAL DE MENSAJES - ÚNICA FUENTE DE PROCESAMIENTO
      vapi.on('message', (message: any) => {
        console.log('📩 VAPI Message received:', message.type);
        
        // Handle speech start/end via message events for Simli integration
        if (message.type === 'speech-update') {
          if (message.status === 'started' && message.role === 'assistant') {
            console.log('🗣️ VAPI: Assistant started speaking');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vapiSpeechStart'));
            }
          } else if (message.status === 'ended' && message.role === 'assistant') {
            console.log('🔇 VAPI: Assistant stopped speaking');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vapiSpeechEnd'));
            }
          }
        }
        
        // DEBUGGING COMPLETO: Mostrar contenido de tool-calls
        if (message.type === 'tool-calls') {
          console.log('🔍 FULL tool-calls message:', JSON.stringify(message, null, 2));
        }
        
        // CAPTURAR TOOL-CALLS (formato que VAPI está usando actualmente)
        if (message.type === 'tool-calls' && message.toolCalls && Array.isArray(message.toolCalls)) {
          console.log('🔧 TOOL-CALLS DETECTED - PROCESANDO PRODUCTOS');
          
          for (const toolCall of message.toolCalls) {
            console.log('🛠️ Processing tool call:', JSON.stringify(toolCall, null, 2));
            
            if (toolCall.function?.name === 'updateOrder') {
              try {
                let orderData;
                
                // Parsear argumentos (pueden venir como string o objeto)
                if (typeof toolCall.function.arguments === 'string') {
                  const parameters = JSON.parse(toolCall.function.arguments);
                  orderData = parameters.orderDetailsData;
                } else if (toolCall.function.arguments?.orderDetailsData) {
                  orderData = toolCall.function.arguments.orderDetailsData;
                } else {
                  console.log('⚠️ No orderDetailsData found in arguments');
                  continue;
                }
                
                console.log('📋 Order data extracted from tool-calls:', orderData);
                
                if (Array.isArray(orderData) && orderData.length > 0) {
                  console.log('✅ VALID ORDER DATA - UPDATING CART');
                  setOrderStatus('in-progress');
                  const updatedCart = addToCart(orderData);
                  
                  const itemCount = updatedCart?.length || 0;
                  const itemWord = itemCount === 1 ? 'artículo' : 'artículos';
                  dispatchNotification('success', '¡Orden Actualizada!', `${itemCount} ${itemWord} en tu orden`);
                  
                  console.log('✅ tool-calls updateOrder processed successfully');
                } else {
                  console.log('❌ Invalid or empty order data:', orderData);
                }
              } catch (error) {
                console.error('❌ Error processing tool-calls updateOrder:', error);
                console.error('❌ Tool call arguments:', toolCall.function.arguments);
              }
            }
          }
        }
        
        // CAPTURAR FUNCTION-CALLS (formato original de VAPI) 
        if (message.type === 'function-call' && message.functionCall?.name === 'updateOrder') {
          console.log('🔧 FUNCTION CALL DETECTED - ÚNICA FUENTE DE PRODUCTOS:', JSON.stringify(message, null, 2));
          
          try {
            const parameters = typeof message.functionCall.parameters === 'string' 
              ? JSON.parse(message.functionCall.parameters)
              : message.functionCall.parameters;
            
            const orderData = parameters.orderDetailsData;
            console.log('📋 Order data from updateOrder function call:', orderData);
            
            if (Array.isArray(orderData) && orderData.length > 0) {
              setOrderStatus('in-progress');
              const updatedCart = addToCart(orderData);
              
              const itemCount = updatedCart?.length || 0;
              const itemWord = itemCount === 1 ? 'artículo' : 'artículos';
              dispatchNotification('success', '¡Orden Actualizada!', `${itemCount} ${itemWord} en tu orden`);
              
              console.log('✅ updateOrder function call processed successfully');
            }
            
          } catch (error) {
            console.error('❌ Error processing updateOrder function call:', error);
          }
        }

        // SOLO LOGGING DE TRANSCRIPTS - NO PROCESAMIENTO DE PRODUCTOS
        if (message.type === 'transcript' && message.role === 'assistant') {
          const transcript = message.transcript;
          console.log(`📝 🤖 ASSISTANT transcript:`, transcript);
          // NOTA: Los productos se procesan ÚNICAMENTE a través de updateOrder function calls
        }

        // LOGGING DE MODEL OUTPUT (para debugging)
        if (message.type === 'model-output' && message.output) {
          console.log('📄 Model output received (for debugging only):', message.output.slice(0, 100) + '...');
        }
      });

      console.log('✅ VAPI initialized successfully');
      
    } catch (err) {
      console.error('❌ Failed to initialize VAPI:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize VAPI');
    }
  }, []);

  // Start call
  const startCall = useCallback(async () => {
    console.log('📞 startCall() called');
    
    if (!vapiRef.current) {
      const errorMsg = 'VAPI not initialized - cannot start call';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      const errorMsg = 'Missing VAPI Assistant ID';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      console.log('📞 Starting VAPI call with assistant:', assistantId.slice(0, 8) + '...');
      setIsLoading(true);
      setConnectionStatus(ConnectionStatus.CONNECTING);
      setError(null);

      console.log('📞 Calling vapi.start()...');
      await vapiRef.current.start(assistantId);
      console.log('✅ VAPI call started successfully');
      
    } catch (err) {
      console.error('❌ Failed to start VAPI call:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start call';
      setError(errorMessage);
      setConnectionStatus(ConnectionStatus.ERROR);
      setIsLoading(false);
      
      // También dispatch una notificación
      dispatchNotification('error', 'Connection Failed', errorMessage);
    }
  }, []);

  // End call
  const endCall = useCallback(() => {
    if (!vapiRef.current) return;

    try {
      console.log('📞 Ending VAPI call...');
      vapiRef.current.stop();
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setOrderStatus('none');
      setError(null);
    } catch (err) {
      console.error('❌ Failed to end VAPI call:', err);
    }
  }, []);

  // Send message to VAPI
  const sendMessage = useCallback((message: string) => {
    if (!vapiRef.current) {
      console.warn('⚠️ VAPI not initialized, cannot send message');
      return;
    }

    try {
      vapiRef.current.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message
        }
      });
      console.log('📤 Message sent to VAPI:', message);
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  }, []);

  // Complete order
  const completeOrder = useCallback(() => {
    setOrderStatus('completed');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orderCompleted'));
    }
  }, []);

  // New order
  const newOrder = useCallback(() => {
    setOrderStatus('none');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('callEnded'));
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeVapi();
    
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (err) {
          console.error('❌ Error during cleanup:', err);
        }
      }
    };
  }, [initializeVapi]);

  return {
    connectionStatus,
    error,
    isLoading,
    orderStatus,
    startCall,
    endCall,
    sendMessage,
    completeOrder,
    newOrder,
    vapi: vapiRef.current
  };
}
