// 🧪 DR. DONUT - TEST COMPLETO DE INTEGRACIÓN
// Pegar en la consola del navegador DESPUÉS de iniciar la aplicación

console.log('🍩 DR. DONUT - TEST SUITE INICIADO');
console.log('=================================\n');

window.drDonutTests = {
  
  // 1. DIAGNÓSTICO INICIAL
  initialDiagnosis: () => {
    console.log('🔍 DIAGNÓSTICO INICIAL:');
    console.log('======================');
    
    // Check environment variables
    const vapiKey = typeof window !== 'undefined' && process?.env?.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const vapiAssistant = typeof window !== 'undefined' && process?.env?.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    const simliKey = typeof window !== 'undefined' && process?.env?.NEXT_PUBLIC_SIMLI_API_KEY;
    
    console.log(`✅ VAPI Key: ${vapiKey ? 'CONFIGURADO' : '❌ FALTANTE'}`);
    console.log(`✅ VAPI Assistant: ${vapiAssistant ? 'CONFIGURADO' : '❌ FALTANTE'}`);
    console.log(`✅ Simli Key: ${simliKey ? 'CONFIGURADO' : '❌ FALTANTE'}`);
    
    // Check instances
    const simliInstance = window.getSimliInstance?.();
    const vapiInstance = window.vapi;
    
    console.log(`✅ Simli Instance: ${simliInstance ? 'DISPONIBLE' : '❌ NO ENCONTRADA'}`);
    console.log(`✅ VAPI Instance: ${vapiInstance ? 'DISPONIBLE' : '❌ NO ENCONTRADA'}`);
    
    console.log('\n');
  },

  // 2. TEST TTS DE SIMLI
  testSimliTTS: async () => {
    console.log('🎤 TESTING SIMLI TTS:');
    console.log('====================');
    
    const simliInstance = window.getSimliInstance?.();
    if (!simliInstance) {
      console.error('❌ Simli instance no disponible');
      return false;
    }
    
    try {
      const testText = "Hola, bienvenido a Doctor Donut. ¿Qué deliciosas donas puedo prepararte hoy?";
      console.log('📤 Enviando texto:', testText);
      
      await simliInstance.sendTextMessage(testText);
      console.log('✅ TTS enviado exitosamente');
      console.log('👁️ OBSERVAR: El avatar debería estar hablando ahora');
      return true;
    } catch (error) {
      console.error('❌ Error en TTS:', error);
      return false;
    }
  },

  // 3. TEST CONEXIÓN VAPI-SIMLI
  testVapiSimliConnection: () => {
    console.log('🔗 TESTING VAPI-SIMLI CONNECTION:');
    console.log('=================================');
    
    if (typeof window.connectVapiToSimli === 'function') {
      console.log('📞 Intentando conectar VAPI a Simli...');
      window.connectVapiToSimli();
      console.log('✅ Comando de conexión ejecutado');
    } else {
      console.error('❌ Función connectVapiToSimli no disponible');
    }
  },

  // 4. SIMULAR FUNCTION CALL
  simulateFunctionCall: () => {
    console.log('⚙️ SIMULANDO FUNCTION CALL:');
    console.log('============================');
    
    const mockOrder = [
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
    ];
    
    console.log('📋 Orden simulada:', mockOrder);
    
    try {
      window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
        detail: JSON.stringify(mockOrder)
      }));
      console.log('✅ Evento orderDetailsUpdated disparado');
      console.log('👁️ VERIFICAR: La orden debería aparecer en el panel derecho');
    } catch (error) {
      console.error('❌ Error simulando function call:', error);
    }
  },

  // 5. TEST COMPLETO DE INTEGRACIÓN
  fullIntegrationTest: async () => {
    console.log('🚀 TEST COMPLETO DE INTEGRACIÓN:');
    console.log('================================');
    
    console.log('\n1️⃣ Diagnosis inicial...');
    drDonutTests.initialDiagnosis();
    
    console.log('\n2️⃣ Testing Simli TTS...');
    const ttsSuccess = await drDonutTests.testSimliTTS();
    
    console.log('\n3️⃣ Testing VAPI-Simli connection...');
    drDonutTests.testVapiSimliConnection();
    
    console.log('\n4️⃣ Simulando function call...');
    drDonutTests.simulateFunctionCall();
    
    console.log('\n📊 RESUMEN DEL TEST:');
    console.log('==================');
    console.log(`TTS Simli: ${ttsSuccess ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log('VAPI-Simli Connection: ✅ EJECUTADO');
    console.log('Function Call Simulation: ✅ EJECUTADO');
    
    console.log('\n🔍 PASOS MANUALES REQUERIDOS:');
    console.log('1. Hacer click en "Start Order"');
    console.log('2. Hablar: "Quiero una dona de chocolate"');
    console.log('3. Verificar que el avatar responde hablando');
    console.log('4. Verificar que la orden aparece en el panel derecho');
    
    console.log('\n✅ Test completo finalizado');
  },

  // 6. MONITOR DE EVENTOS
  monitorEvents: () => {
    console.log('👂 MONITOREANDO EVENTOS DE VAPI:');
    console.log('================================');
    
    const events = ['orderDetailsUpdated', 'vapiAssistantTranscript', 'addNotification'];
    
    events.forEach(eventName => {
      window.addEventListener(eventName, (event) => {
        console.log(`🎯 EVENTO CAPTURADO: ${eventName}`, event.detail);
      });
    });
    
    console.log('✅ Monitoreando:', events.join(', '));
    console.log('👁️ Los eventos aparecerán automáticamente en la consola');
  },

  // 7. AYUDA
  help: () => {
    console.log('❓ COMANDOS DISPONIBLES:');
    console.log('=======================');
    console.log('drDonutTests.initialDiagnosis()     - Revisar configuración');
    console.log('drDonutTests.testSimliTTS()         - Test TTS del avatar');
    console.log('drDonutTests.testVapiSimliConnection() - Test conexión audio');
    console.log('drDonutTests.simulateFunctionCall() - Simular actualización de orden');
    console.log('drDonutTests.fullIntegrationTest()  - Test completo');
    console.log('drDonutTests.monitorEvents()        - Monitorear eventos');
    console.log('drDonutTests.help()                 - Esta ayuda');
    console.log('\n🚨 TROUBLESHOOTING RÁPIDO:');
    console.log('1. Si avatar no habla → drDonutTests.testSimliTTS()');
    console.log('2. Si no hay function calls → drDonutTests.simulateFunctionCall()');
    console.log('3. Si no se conecta audio → drDonutTests.testVapiSimliConnection()');
    console.log('4. Para test completo → drDonutTests.fullIntegrationTest()');
  }
};

// Auto-ejecutar diagnosis inicial
console.log('✅ Test suite cargado exitosamente');
console.log('🎯 Ejecuta: drDonutTests.fullIntegrationTest()');
console.log('❓ Para ayuda: drDonutTests.help()');

// Activar monitoreo de eventos automáticamente
drDonutTests.monitorEvents();
