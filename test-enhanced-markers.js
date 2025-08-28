// SCRIPT DE TESTING MEJORADO PARA ORDER MARKERS
// Ejecutar en la consola del navegador

console.log('🧪 TESTING ENHANCED ORDER MARKERS - Script cargado');
console.log('====================================================');

// 1. Test de simulación de model-output fragmentado (como en los logs reales)
function simulateRealModelOutput() {
  console.log('🧪 Simulando model-output fragmentado real...');
  
  // Simular la secuencia real de model-output que vimos en los logs
  const modelOutputSequence = [
    '```',
    'json',
    '\n',
    '<!--',
    'ORDER',
    '_UPDATE',
    '-->\n',
    '[',
    '{"name":',
    ' "',
    'Dona de pastel con especias de calabaza',
    '", "',
    'quantity',
    '": ',
    '1',
    ', "',
    'price',
    '": ',
    '1',
    '.',
    '29',
    '}, ',
    '{"',
    'name',
    '": "',
    'Dona glaseada con especias de calabaza',
    '", "',
    'quantity',
    '": ',
    '1',
    ', "',
    'price',
    '": ',
    '1',
    '.',
    '29',
    '}]\n',
    '<!--',
    '/',
    'ORDER',
    '_UPDATE',
    '-->\n',
    '```'
  ];
  
  // Simular el envío fragmentado como lo hace VAPI
  let buffer = '';
  modelOutputSequence.forEach((fragment, index) => {
    buffer += fragment;
    
    // Simular el evento de VAPI
    const mockMessage = {
      type: 'model-output',
      output: fragment
    };
    
    console.log(`📤 Fragment ${index + 1}: "${fragment}"`);
    console.log(`📦 Buffer actual: "${buffer}"`);
    
    // Buscar marcador completo en el buffer
    const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
    const match = buffer.match(orderUpdateRegex);
    
    if (match) {
      console.log('🎯 MARCADOR COMPLETO ENCONTRADO!', match[1]);
      try {
        const orderData = JSON.parse(match[1]);
        console.log('✅ JSON parseado correctamente:', orderData);
        
        // Dispatch el evento real
        window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
          detail: JSON.stringify(orderData)
        }));
        console.log('✅ Evento orderDetailsUpdated enviado');
        
        // Limpiar buffer
        buffer = '';
        return;
        
      } catch (e) {
        console.error('❌ Error parseando JSON:', e);
      }
    }
  });
}

// 2. Monitor en tiempo real mejorado
function startEnhancedOrderMonitor() {
  console.log('🔍 Iniciando monitor mejorado de órdenes...');
  console.log('💬 Habla con VAPI y di: "Una dona de chocolate y un té"');
  
  // Interceptar console.log para detectar patrones específicos
  let originalConsoleLog = console.log;
  console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      // Detectar model-output
      if (args[0].includes('model-output')) {
        console.warn('📊 MODEL OUTPUT:', ...args);
      }
      
      // Detectar acumulación de transcripts
      if (args[0].includes('🔍 Accumulated transcript')) {
        console.warn('📝 TRANSCRIPT ACUMULADO:', ...args);
      }
      
      // Detectar marcadores encontrados
      if (args[0].includes('🎯 ORDER_UPDATE marker found')) {
        console.warn('🎉 MARCADOR DETECTADO:', ...args);
      }
      
      // Detectar procesamiento de órdenes
      if (args[0].includes('📋 Processing order')) {
        console.warn('⚡ PROCESANDO ORDEN:', ...args);
      }
      
      // Detectar eventos dispatch
      if (args[0].includes('📡 Dispatched orderDetailsUpdated')) {
        console.warn('📡 EVENTO ENVIADO:', ...args);
      }
    }
    originalConsoleLog.apply(console, args);
  };
  
  // Auto-restaurar después de 60 segundos
  setTimeout(() => {
    console.log = originalConsoleLog;
    console.log('⏰ Monitor mejorado finalizado');
  }, 60000);
  
  console.log('✅ Monitor mejorado activo por 60 segundos');
}

// 3. Verificar estado del buffer
function checkBufferState() {
  console.log('🔍 Verificando estado de buffers...');
  
  if (window.modelOutputBuffer) {
    console.log('📦 Model Output Buffer:', window.modelOutputBuffer.slice(-200));
    console.log('📏 Buffer length:', window.modelOutputBuffer.length);
  } else {
    console.log('❌ Model Output Buffer no existe');
  }
  
  // Verificar si hay algún patrón ORDER_UPDATE en el buffer actual
  if (window.modelOutputBuffer) {
    const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
    const match = window.modelOutputBuffer.match(orderUpdateRegex);
    
    if (match) {
      console.log('🎯 MARCADOR ENCONTRADO EN BUFFER ACTUAL:', match[1]);
    } else {
      console.log('❌ No se encontró marcador en buffer actual');
    }
  }
}

// 4. Limpiar buffers manualmente
function clearBuffers() {
  console.log('🧹 Limpiando buffers...');
  if (window.modelOutputBuffer) {
    window.modelOutputBuffer = '';
    console.log('✅ Model output buffer limpiado');
  }
}

// 5. Test completo mejorado
function runEnhancedTest() {
  console.log('🚀 EJECUTANDO TEST MEJORADO...');
  console.log('================================');
  
  setTimeout(() => {
    console.log('1️⃣ Testing simulated model output...');
    simulateRealModelOutput();
  }, 1000);
  
  setTimeout(() => {
    console.log('2️⃣ Checking current buffer state...');
    checkBufferState();
  }, 3000);
  
  setTimeout(() => {
    console.log('3️⃣ Starting enhanced monitor...');
    startEnhancedOrderMonitor();
  }, 4000);
  
  console.log('⏳ Tests mejorados programados...');
}

// Funciones disponibles
window.simulateRealModelOutput = simulateRealModelOutput;
window.startEnhancedOrderMonitor = startEnhancedOrderMonitor;
window.checkBufferState = checkBufferState;
window.clearBuffers = clearBuffers;
window.runEnhancedTest = runEnhancedTest;

console.log('🔧 Funciones mejoradas disponibles:');
console.log('- simulateRealModelOutput()');
console.log('- startEnhancedOrderMonitor()');
console.log('- checkBufferState()');
console.log('- clearBuffers()');
console.log('- runEnhancedTest()');
console.log('');
console.log('💡 Recomendado: Ejecutar runEnhancedTest()');
