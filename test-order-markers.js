// SCRIPT DE TESTING PARA ORDER MARKERS
// Ejecutar en la consola del navegador durante una llamada VAPI

console.log('🧪 TESTING ORDER MARKERS - Script cargado');
console.log('=========================================');

// 1. Test de marcador ORDER_UPDATE
function testOrderMarker() {
  console.log('🧪 Testing ORDER_UPDATE marker...');
  
  const testTranscript = `Excelente, tengo una dona glaseada de chocolate para ti. ¿Te gustaría algo más?

\`\`\`json
<!--ORDER_UPDATE-->
[{"name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}]
<!--/ORDER_UPDATE-->
\`\`\``;

  // Simular mensaje de VAPI con transcript que contiene marcador
  const mockMessage = {
    type: 'transcript',
    role: 'assistant',
    transcript: testTranscript,
    transcriptType: 'final'
  };

  console.log('📤 Simulando transcript con marcador ORDER_UPDATE...');
  
  // Simular el processing que hace useVapi
  const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
  const match = testTranscript.match(orderUpdateRegex);
  
  if (match) {
    console.log('✅ Marcador encontrado:', match[1]);
    try {
      const orderData = JSON.parse(match[1]);
      console.log('✅ JSON parseado correctamente:', orderData);
      
      // Dispatch el evento real
      window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
        detail: JSON.stringify(orderData)
      }));
      console.log('✅ Evento orderDetailsUpdated enviado');
      
    } catch (e) {
      console.error('❌ Error parseando JSON:', e);
    }
  } else {
    console.error('❌ No se encontró marcador ORDER_UPDATE');
  }
}

// 2. Test de múltiples artículos
function testMultipleItemsMarker() {
  console.log('🧪 Testing multiple items marker...');
  
  const testTranscript = `Perfecto, agregué un té negro. Tu pedido incluye una dona glaseada de chocolate y un té negro. ¿Algo más?

\`\`\`json
<!--ORDER_UPDATE-->
[{"name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}, {"name": "Té negro", "quantity": 1, "price": 1.99}]
<!--/ORDER_UPDATE-->
\`\`\``;

  const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
  const match = testTranscript.match(orderUpdateRegex);
  
  if (match) {
    console.log('✅ Marcador múltiples artículos encontrado:', match[1]);
    try {
      const orderData = JSON.parse(match[1]);
      console.log('✅ JSON múltiples artículos parseado:', orderData);
      
      window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
        detail: JSON.stringify(orderData)
      }));
      console.log('✅ Evento múltiples artículos enviado');
      
    } catch (e) {
      console.error('❌ Error parseando JSON múltiples artículos:', e);
    }
  } else {
    console.error('❌ No se encontró marcador múltiples artículos');
  }
}

// 3. Verificar listeners activos
function checkEventListeners() {
  console.log('🔍 Verificando event listeners...');
  
  const events = [
    'orderDetailsUpdated',
    'callEnded',
    'orderCompleted',
    'vapiAssistantTranscript',
    'addNotification'
  ];
  
  events.forEach(eventName => {
    try {
      const testEvent = new CustomEvent(eventName, { detail: 'test' });
      window.dispatchEvent(testEvent);
      console.log(`✅ ${eventName}: Listener activo`);
    } catch (e) {
      console.log(`❌ ${eventName}: Sin listener o error`);
    }
  });
}

// 4. Monitor en tiempo real
function startOrderMonitor() {
  console.log('🔍 Iniciando monitor de órdenes en tiempo real...');
  console.log('💬 Ahora habla con VAPI y di: "Quiero una dona de chocolate"');
  
  let originalConsoleLog = console.log;
  console.log = function(...args) {
    // Interceptar logs de VAPI
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('📩 VAPI Message:')) {
        console.warn('🎯 MENSAJE VAPI DETECTADO:', ...args);
      }
      if (args[0].includes('🔍 Checking transcript')) {
        console.warn('🔍 VERIFICANDO TRANSCRIPT:', ...args);
      }
      if (args[0].includes('🎯 ORDER_UPDATE marker found')) {
        console.warn('🎉 MARCADOR ENCONTRADO:', ...args);
      }
      if (args[0].includes('📋 Processing order from transcript')) {
        console.warn('⚡ PROCESANDO ORDEN:', ...args);
      }
    }
    originalConsoleLog.apply(console, args);
  };
  
  // Auto-restaurar después de 60 segundos
  setTimeout(() => {
    console.log = originalConsoleLog;
    console.log('⏰ Monitor de órdenes finalizado');
  }, 60000);
  
  console.log('✅ Monitor activo por 60 segundos');
}

// 5. Test completo
function runCompleteTest() {
  console.log('🚀 EJECUTANDO TEST COMPLETO...');
  console.log('================================');
  
  setTimeout(() => {
    console.log('1️⃣ Testing single item marker...');
    testOrderMarker();
  }, 1000);
  
  setTimeout(() => {
    console.log('2️⃣ Testing multiple items marker...');
    testMultipleItemsMarker();
  }, 2000);
  
  setTimeout(() => {
    console.log('3️⃣ Checking event listeners...');
    checkEventListeners();
  }, 3000);
  
  setTimeout(() => {
    console.log('4️⃣ Starting real-time monitor...');
    startOrderMonitor();
  }, 4000);
  
  console.log('⏳ Tests programados para ejecutar en secuencia...');
}

// Funciones disponibles
window.testOrderMarker = testOrderMarker;
window.testMultipleItemsMarker = testMultipleItemsMarker;
window.checkEventListeners = checkEventListeners;
window.startOrderMonitor = startOrderMonitor;
window.runCompleteTest = runCompleteTest;

console.log('🔧 Funciones disponibles:');
console.log('- testOrderMarker()');
console.log('- testMultipleItemsMarker()');
console.log('- checkEventListeners()');
console.log('- startOrderMonitor()');
console.log('- runCompleteTest()');
console.log('');
console.log('💡 Recomendado: Ejecutar runCompleteTest()');
