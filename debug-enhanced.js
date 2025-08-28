// Script de debug especializado para Dr. Donut
// Pegar en la consola del navegador

console.log('🔧 DR. DONUT DEBUG TOOLS - VERSIÓN MEJORADA');
console.log('===========================================\n');

window.drDonutDebug = {
  // Test manual de función updateOrder
  testOrderUpdate: () => {
    console.log('📋 Probando actualización de orden manual...');
    
    const testOrder = [
      {
        name: "DONA GLASEADA DE CHOCOLATE",
        quantity: 2,
        price: 1.09
      },
      {
        name: "CAFÉ AMERICANO REGULAR", 
        quantity: 1,
        price: 1.79
      }
    ];
    
    // Disparar evento de orden manual
    window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
      detail: JSON.stringify(testOrder)
    }));
    
    console.log('✅ Evento orderDetailsUpdated disparado');
    console.log('📋 Orden de prueba:', testOrder);
    console.log('👀 Verifica si aparece en el panel derecho');
    
    return testOrder;
  },

  // Monitor ESPECÍFICO para function calls
  monitorFunctionCalls: () => {
    console.log('🎯 Monitoreando function calls de VAPI...');
    
    // Override console.log temporarily to catch VAPI function calls
    const originalLog = console.log;
    
    // Intercept all console logs to catch function calls
    console.log = function(...args) {
      const message = args.join(' ');
      
      if (message.includes('Function Call') || message.includes('function-call')) {
        console.log('🚨 FUNCTION CALL DETECTED:', ...args);
      }
      
      originalLog.apply(console, args);
    };
    
    console.log('👁️ Interceptando logs de function calls...');
    console.log('💬 Ahora habla al micrófono: "Quiero una dona de chocolate"');
    
    // Restore after 30 seconds
    setTimeout(() => {
      console.log = originalLog;
      console.log('🔄 Log interception restored');
    }, 30000);
  },

  // Check VAPI configuration
  checkVapiConfig: () => {
    console.log('🗣️ Verificando configuración de VAPI...');
    
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    console.log('- VAPI Public Key:', publicKey ? `${publicKey.slice(0, 8)}...` : 'NOT SET');
    console.log('- Assistant ID:', assistantId ? `${assistantId.slice(0, 8)}...` : 'NOT SET');
    
    if (!publicKey || !publicKey.startsWith('pk_')) {
      console.error('❌ VAPI Public Key inválida');
    }
    
    if (!assistantId) {
      console.error('❌ VAPI Assistant ID no configurado');
    }
    
    // Check if VAPI instance exists
    if (window.vapi) {
      console.log('✅ Instancia de VAPI encontrada');
    } else {
      console.log('❌ No se encontró instancia de VAPI');
    }
  },

  // Simular function call de VAPI
  simulateVapiFunctionCall: () => {
    console.log('🧪 Simulando function call de VAPI...');
    
    const mockFunctionCall = {
      type: 'function-call',
      functionCall: {
        name: 'updateOrder',
        parameters: {
          orderDetailsData: [
            {
              name: "DONA GLASEADA DE CHOCOLATE",
              quantity: 1,
              price: 1.09
            }
          ]
        }
      }
    };
    
    // Dispatch both possible event types
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vapiMessage', {
        detail: mockFunctionCall
      }));
      
      window.dispatchEvent(new CustomEvent('vapiFunctionCall', {
        detail: mockFunctionCall.functionCall
      }));
    }
    
    console.log('📡 Function call simulado enviado');
    console.log('📋 Mock data:', mockFunctionCall);
  },

  // Monitor ALL VAPI events
  monitorAllVapiEvents: () => {
    console.log('👁️ Monitoreando TODOS los eventos de VAPI...');
    
    const vapiEvents = [
      'call-start', 'call-end', 'speech-start', 'speech-end',
      'message', 'function-call', 'error', 'audio', 'transcript',
      'assistant-speech-start', 'assistant-speech-end', 'conversation-update'
    ];
    
    vapiEvents.forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        console.log(`🎯 VAPI Event [${eventName}]:`, e.detail || e);
      });
    });
    
    console.log('📡 Monitoreando eventos:', vapiEvents.join(', '));
  },

  // Force order update
  forceOrderUpdate: (items) => {
    console.log('🔨 Forzando actualización de orden...');
    
    const orderData = items || [
      { name: "DONA GLASEADA DE CHOCOLATE", quantity: 1, price: 1.09 },
      { name: "CAFÉ AMERICANO REGULAR", quantity: 1, price: 1.79 }
    ];
    
    // Try multiple ways to trigger the update
    window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
      detail: JSON.stringify(orderData)
    }));
    
    // Also try direct function call
    if (window.updateOrderDirectly) {
      window.updateOrderDirectly(orderData);
    }
    
    console.log('✅ Orden forzada:', orderData);
  },

  // Complete diagnostic
  fullDiagnostic: () => {
    console.log('🏥 DIAGNÓSTICO COMPLETO');
    console.log('========================\n');
    
    // 1. Environment check
    console.log('1️⃣ Variables de entorno:');
    console.log('   VAPI Key:', process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? '✅' : '❌');
    console.log('   Assistant ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? '✅' : '❌');
    console.log('   Simli Key:', process.env.NEXT_PUBLIC_SIMLI_API_KEY ? '✅' : '❌');
    console.log('   Simli Face ID:', process.env.NEXT_PUBLIC_SIMLI_FACE_ID ? '✅' : '❌');
    
    // 2. DOM elements
    console.log('\n2️⃣ Elementos DOM:');
    console.log('   Video element:', document.querySelector('video') ? '✅' : '❌');
    console.log('   Audio element:', document.querySelector('audio') ? '✅' : '❌');
    
    // 3. VAPI instance
    console.log('\n3️⃣ VAPI:');
    console.log('   Global VAPI:', window.Vapi ? '✅' : '❌');
    console.log('   VAPI instance:', window.vapi ? '✅' : '❌');
    
    // 4. Simli instance
    console.log('\n4️⃣ Simli:');
    console.log('   Simli instance:', window.getSimliInstance?.() ? '✅' : '❌');
    
    // 5. Event listeners
    console.log('\n5️⃣ Iniciando monitoreo de eventos...');
    this.monitorAllVapiEvents();
    this.monitorFunctionCalls();
    
    console.log('\n💡 Ahora habla al micrófono y observa los logs');
  },

  help: () => {
    console.log('❓ COMANDOS DE DEBUG MEJORADOS:');
    console.log('===============================');
    console.log('drDonutDebug.testOrderUpdate()       - Test manual de órdenes');
    console.log('drDonutDebug.simulateVapiFunctionCall() - Simular function call');
    console.log('drDonutDebug.monitorFunctionCalls()   - Monitor function calls');
    console.log('drDonutDebug.checkVapiConfig()        - Verificar config VAPI');
    console.log('drDonutDebug.forceOrderUpdate()       - Forzar actualización');
    console.log('drDonutDebug.fullDiagnostic()         - Diagnóstico completo');
    console.log('drDonutDebug.help()                   - Esta ayuda');
    console.log('\n🚨 PASOS PARA TROUBLESHOOTING:');
    console.log('1. drDonutDebug.fullDiagnostic()');
    console.log('2. Hablar al micrófono');
    console.log('3. Si no hay function calls -> revisar config VAPI');
    console.log('4. drDonutDebug.simulateVapiFunctionCall() para test');
  }
};

// Auto-start monitoring
console.log('✅ Debug tools mejoradas cargadas');
console.log('🎯 Ejecuta: drDonutDebug.fullDiagnostic()');
