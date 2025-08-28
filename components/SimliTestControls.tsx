'use client';

import React from 'react';

export const SimliTestControls: React.FC = () => {
  const testSimliTTS = async (text: string) => {
    const simliInstance = (window as any).getSimliInstance?.();
    if (simliInstance) {
      try {
        console.log('🧪 Testing Simli TTS:', text);
        // Updated to use available method instead of sendTextMessage
        const audioData = new Uint8Array(6000).fill(0);
        simliInstance.sendAudioData(audioData);
        console.log('✅ Test audio sent successfully');
        console.log('ℹ️ Note: Text-to-speech is handled by VAPI, not directly by Simli');
      } catch (error) {
        console.error('❌ TTS error:', error);
      }
    } else {
      console.warn('⚠️ Simli not available');
    }
  };

  const simulateVapiResponse = (text: string) => {
    console.log('🧪 Simulating VAPI response:', text);
    window.dispatchEvent(new CustomEvent('vapiAssistantTranscript', {
      detail: { text, timestamp: Date.now() }
    }));
  };

  // Return null to not render anything (component disabled for production)
  return null;

  // Uncomment below for testing controls during development
  // return (
  //   <div className="fixed bottom-20 left-4 bg-gray-900 border border-cyan-500 rounded-lg p-4 space-y-2 z-50">
  //     <h4 className="text-cyan-400 text-sm font-bold">🧪 Simli TTS Tests</h4>
      
  //     <button
  //       onClick={() => testSimliTTS("Hola, bienvenido a Doctor Donut")}
  //       className="block w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
  //     >
  //       Test Saludo
  //     </button>
      
  //     <button
  //       onClick={() => testSimliTTS("Perfecto, tengo una dona glaseada de chocolate para ti")}
  //       className="block w-full px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
  //     >
  //       Test Orden
  //     </button>
      
  //     <button
  //       onClick={() => simulateVapiResponse("¿Te gustaría agregar algo más?")}
  //       className="block w-full px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded"
  //     >
  //       Simulate VAPI
  //     </button>
      
  //     <button
  //       onClick={() => {
  //         const testOrder = [
  //           { name: "DONA GLASEADA DE CHOCOLATE", quantity: 1, price: 1.09 },
  //           { name: "CAFÉ AMERICANO REGULAR", quantity: 1, price: 1.79 }
  //         ];
  //         window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
  //           detail: JSON.stringify(testOrder)
  //         }));
  //       }}
  //       className="block w-full px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
  //     >
  //       Test Order Update
  //     </button>
  //   </div>
  // );
};
