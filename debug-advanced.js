// 🚨 DEBUG ESPECIALIZADO PARA FUNCTION CALLS Y TTS
// Pegar en la consola del navegador DESPUÉS de iniciar la aplicación

console.log('🔧 DR. DONUT - DIAGNÓSTICO FUNCIÓN CALLS Y TTS');
console.log('================================================\n');

window.drDonutAdvanced = {
  // 1. DIAGNÓSTICO COMPLETO
  fullDiagnosis: async () => {
    console.log('🏥 DIAGNÓSTICO COMPLETO INICIADO...\n');
    
    // Check environment
    console.log('1️⃣ VARIABLES DE ENTORNO:');
    const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const vapiAssistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    const simliKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY;
    const simliFace = process.env.NEXT_PUBLIC_SIMLI_FACE_ID;
    
    console.log(`   VAPI Key: ${vapiKey ? '✅ SET (' + vapiKey.slice(0,8) + '...)' : '❌ MISSING'}`);
    console.log(`   VAPI Assistant: ${vapiAssistant ? '✅ SET (' + vapiAssistant.slice(0,8) + '...)' : '❌ MISSING'}`);
    console.log(`   Simli Key: ${simliKey ? '✅ SET (' + simliKey.slice(0,8) + '...)' : '❌ MISSING'}`);
    console.log(`   Simli Face: ${simliFace ? '✅ SET (' + simliFace.slice(0,8) + '...)' : '❌ MISSING'}`);
    
    // Check instances
    console.log('\n2️⃣ INSTANCIAS:');
    const simliInstance = window.getSimliInstance?.();
    const vapiInstance = window.vapi;
    
    console.log(`   Simli Instance: ${simliInstance ? '✅ CONNECTED' : '❌ NOT FOUND'}`);
    console.log(`   VAPI Instance: ${vapiInstance ? '✅ CONNECTED' : '❌ NOT FOUND'}`);
    
    // Test TTS
    console.log('\n3️⃣ TESTING SIMLI TTS...');
    if (simliInstance) {
      try {
        await simliInstance.sendTextMessage("Test de sincronización de labios");
        console.log('   ✅ TTS Test PASSED - Avatar debería estar hablando');
      } catch (error) {
        console.log('   ❌ TTS Test FAILED:', error.message);
      }
    } else {
      console.log('   ❌ No se puede testear TTS - Simli no disponible');
    }
    
    // Monitor function calls
    console.log('\n4️⃣ MONITOREANDO FUNCTION CALLS...');
    this.monitorFunctionCalls();
    
    console.log('\n💡 SIGUIENTE PASO: Habla al micrófono y observa los logs');
  },

  // 2. MONITOR ESPECÍFICO PARA FUNCTION CALLS
  monitorFunctionCalls: () => {
    console.log('🎯 Interceptando TODOS los logs para detectar function calls...');
    
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Function call detection
    const detectFunctionCall = (message) => {
      const msgStr = String(message).toLowerCase();
      
      if (msgStr.includes('function') && (msgStr.includes('call') || msgStr.includes('updateorder'))) {
        console.log('🚨🚨🚨 FUNCTION CALL DETECTED!!! 🚨🚨🚨');
        console.log('📍 Location:', message);
        console.log('🕒 Time:', new Date().toLocaleTimeString());
        return true;
      }
      
      if (msgStr.includes('updateorder')) {
        console.log('🔍 UpdateOrder mention detected:', message);
        return true;
      }
      
      return false;
    };
    
    // Override console methods
    console.log = function(...args) {
      const detected = args.some(detectFunctionCall);
      if (detected) {
        originalLog('🎯 INTERCEPTED LOG:', ...args);
      }
      originalLog.apply(console, args);
    };
    
    console.error = function(...args) {
      const detected = args.some(detectFunctionCall);
      if (detected) {
        originalError('🎯 INTERCEPTED ERROR:', ...args);
      }
      originalError.apply(console, args);
    };
    
    // Auto-restore after 60 seconds
    setTimeout(() => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.log('🔄 Console methods restored');
    }, 60000);
    
    console.log('👁️ Function call monitoring ACTIVE for 60 seconds');
    console.log('🗣️ Now speak: "Quiero una dona de chocolate"');
  },

  // 3. TEST TTS AVANZADO
  testTTS: async (text) => {
    const testText = text || "Perfecto, tengo una dona glaseada de chocolate para ti. Eso sería un dólar nueve centavos.";
    
    console.log('🧪 TESTING SIMLI TTS...');
    console.log('📝 Text:', testText);
    
    const simliInstance = window.getSimliInstance?.();
    if (!simliInstance) {
      console.error('❌ Simli instance not found');
      return false;
    }
    
    try {
      console.log('📤 Sending to Simli...');
      await simliInstance.sendTextMessage(testText);
      console.log('✅ TTS sent successfully');
      console.log('👁️ Watch the avatar - lips should be moving!');
      return true;
    } catch (error) {
      console.error('❌ TTS failed:', error);
      return false;
    }
  },

  // 4. SIMULAR VAPI FUNCTION CALL
  simulateVapiFunctionCall: () => {
    console.log('🧪 SIMULANDO FUNCTION CALL DE VAPI...');
    
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
            },
            {
              name: "CAFÉ AMERICANO REGULAR", 
              quantity: 1,
              price: 1.79
            }
          ]
        }
      }
    };
    
    console.log('📋 Mock function call:', mockFunctionCall);
    
    // Dispatch multiple event types
    const events = [
      'vapiMessage',
      'vapiFunctionCall', 
      'orderDetailsUpdated'
    ];
    
    events.forEach(eventType => {
      try {
        window.dispatchEvent(new CustomEvent(eventType, {
          detail: eventType === 'orderDetailsUpdated' 
            ? JSON.stringify(mockFunctionCall.functionCall.parameters.orderDetailsData)
            : mockFunctionCall
        }));
        console.log(`✅ Dispatched: ${eventType}`);
      } catch (error) {
        console.error(`❌ Failed to dispatch ${eventType}:`, error);
      }
    });
    
    console.log('👀 Check if order appears in right panel');
  },

  // 5. TEST VAPI CONFIGURATION
  testVapiConfig: () => {
    console.log('🗣️ TESTING VAPI CONFIGURATION...');
    
    const vapiInstance = window.vapi;
    if (!vapiInstance) {
      console.error('❌ VAPI instance not found');
      return;
    }
    
    console.log('✅ VAPI instance found');
    
    // Check if call is active
    const isCallActive = vapiInstance.isCallActive || false;
    console.log(`📞 Call active: ${isCallActive ? '✅ YES' : '❌ NO'}`);
    
    if (!isCallActive) {
      console.log('💡 Start a call first by clicking "Start Order"');
      return;
    }
    
    // Check assistant ID
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (assistantId) {
      console.log(`🤖 Assistant ID: ${assistantId.slice(0, 8)}...`);
      console.log('💡 Make sure this assistant has updateOrder function configured');
    }
  },

  // 6. TEST COMPLETO DE INTEGRACIÓN
  testFullIntegration: async () => {
    console.log('🔗 TESTING FULL VAPI-SIMLI INTEGRATION...');
    
    // Step 1: Test TTS
    console.log('\n1️⃣ Testing Simli TTS...');
    const ttsSuccess = await this.testTTS();
    
    if (!ttsSuccess) {
      console.error('❌ TTS failed - check Simli configuration');
      return;
    }
    
    // Step 2: Test function call simulation
    console.log('\n2️⃣ Testing function call simulation...');
    this.simulateVapiFunctionCall();
    
    // Step 3: Test VAPI config
    console.log('\n3️⃣ Testing VAPI configuration...');
    this.testVapiConfig();
    
    // Step 4: Monitor live
    console.log('\n4️⃣ Starting live monitoring...');
    this.monitorFunctionCalls();
    
    console.log('\n✅ Integration test complete');
    console.log('🗣️ Now speak to test live integration');
  },

  // 7. AYUDA
  help: () => {
    console.log('❓ COMANDOS DE DEBUG AVANZADOS:');
    console.log('================================');
    console.log('drDonutAdvanced.fullDiagnosis()      - Diagnóstico completo');
    console.log('drDonutAdvanced.testTTS()            - Test TTS de Simli');
    console.log('drDonutAdvanced.testTTS("texto")     - Test TTS con texto custom');
    console.log('drDonutAdvanced.monitorFunctionCalls() - Monitor function calls');
    console.log('drDonutAdvanced.simulateVapiFunctionCall() - Simular function call');
    console.log('drDonutAdvanced.testVapiConfig()     - Test configuración VAPI');
    console.log('drDonutAdvanced.testFullIntegration() - Test integración completa');
    console.log('drDonutAdvanced.help()               - Esta ayuda');
    console.log('\n🚨 TROUBLESHOOTING:');
    console.log('1. drDonutAdvanced.fullDiagnosis()');
    console.log('2. Si TTS no funciona → revisar claves Simli');
    console.log('3. Si function calls no aparecen → revisar configuración VAPI Dashboard');
    console.log('4. drDonutAdvanced.testFullIntegration() para test completo');
  }
};

// Auto-initialize
console.log('✅ Debug avanzado cargado');
console.log('🎯 Ejecuta: drDonutAdvanced.fullDiagnosis()');
