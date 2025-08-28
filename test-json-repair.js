// TEST ESPECÍFICO PARA DEBUGGING JSON PARSING
// Ejecutar en la consola del navegador

console.log('🧪 TESTING JSON PARSING FIX - Script cargado');
console.log('===============================================');

// Simular exactamente lo que veo en los logs
function simulateActualBrokenOutput() {
  console.log('🧪 Simulando output fragmentado REAL con JSON malformado...');
  
  const actualFragments = [
    '```',
    'json',
    '\n',
    '<!--',
    'ORDER',
    '_UPDATE',
    '-->\n',
    '[',
    'name',  // <- AQUÍ FALTA EL '{'
    '":',
    ' "',
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
    '}]\n', // <- AQUÍ FALTA UNA LLAVE
    '<!--',
    '/',
    'ORDER',
    '_UPDATE',
    '-->\n',
    '```'
  ];
  
  let buffer = '';
  actualFragments.forEach((fragment, index) => {
    buffer += fragment;
    console.log(`📤 Fragment ${index + 1}: "${fragment}"`);
    
    // Buscar marcador
    const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
    const match = buffer.match(orderUpdateRegex);
    
    if (match) {
      console.log('🎯 RAW MATCH encontrado:', match[1]);
      
      try {
        let jsonString = match[1];
        console.log('📝 JSON original:', jsonString);
        
        // Intentar reparar
        if (!jsonString.includes('{"')) {
          // Si falta el '{' al inicio
          jsonString = jsonString.replace('[name":', '[{"name":');
          console.log('🔧 JSON después de repair 1:', jsonString);
        }
        
        // Si falta '}' antes del ']'
        if (!jsonString.includes('}]')) {
          jsonString = jsonString.replace('}]\n', '}]\n');
          // Si no hay '}' pero hay ']', agregar '}'
          if (!jsonString.includes('}') && jsonString.includes(']')) {
            jsonString = jsonString.replace(']', '}]');
            console.log('🔧 JSON después de repair 2:', jsonString);
          }
        }
        
        console.log('✅ JSON final para parsear:', jsonString);
        
        const orderData = JSON.parse(jsonString);
        console.log('🎉 ÉXITO - JSON parseado:', orderData);
        
        // Test the actual dispatch
        window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
          detail: JSON.stringify(orderData)
        }));
        console.log('📡 Evento orderDetailsUpdated enviado con datos reparados');
        
        return;
        
      } catch (e) {
        console.error('❌ Error parseando JSON reparado:', e);
        console.error('❌ JSON que falló:', jsonString);
      }
    }
  });
}

// Test de repair más robusto
function testRobustRepair() {
  console.log('🔧 Testing robust JSON repair...');
  
  const brokenJsons = [
    '[name": "Test", "quantity": 1, "price": 1.29}]',
    '[{"name": "Test", "quantity": 1, "price": 1.29]',
    '[name": "Test", "quantity": 1, "price": 1.29]',
    'name": "Test", "quantity": 1, "price": 1.29}]'
  ];
  
  brokenJsons.forEach((broken, index) => {
    console.log(`\n🧪 Test ${index + 1}: "${broken}"`);
    
    let repaired = broken;
    
    // Fix 1: Agregar '{"' al inicio si falta
    if (!repaired.includes('[{"')) {
      if (repaired.startsWith('[name"')) {
        repaired = repaired.replace('[name"', '[{"name"');
      } else if (repaired.startsWith('name"')) {
        repaired = '[{"' + repaired;
      }
    }
    
    // Fix 2: Agregar '}' antes del ']' si falta
    if (!repaired.includes('}]')) {
      if (repaired.endsWith(']')) {
        repaired = repaired.slice(0, -1) + '}]';
      } else if (!repaired.endsWith('}]')) {
        repaired += '}]';
      }
    }
    
    console.log(`🔧 Repaired: "${repaired}"`);
    
    try {
      const parsed = JSON.parse(repaired);
      console.log(`✅ Success:`, parsed);
    } catch (e) {
      console.error(`❌ Still failed:`, e.message);
    }
  });
}

// Monitor en tiempo real
function startJSONRepairMonitor() {
  console.log('🔍 Iniciando monitor de reparación JSON...');
  
  // Override console.log temporalmente
  let originalLog = console.log;
  console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('🎯 ORDER_UPDATE marker found')) {
      console.warn('🚨 MARKER DETECTADO:', ...args);
    }
    if (args[0] && typeof args[0] === 'string' && args[0].includes('❌ Error parsing JSON')) {
      console.error('🚨 JSON PARSE ERROR:', ...args);
    }
    originalLog.apply(console, args);
  };
  
  setTimeout(() => {
    console.log = originalLog;
    console.log('⏰ JSON repair monitor finalizado');
  }, 60000);
}

// Ejecutar todos los tests
function runAllTests() {
  console.log('🚀 EJECUTANDO TODOS LOS TESTS...');
  
  setTimeout(() => {
    testRobustRepair();
  }, 1000);
  
  setTimeout(() => {
    simulateActualBrokenOutput();
  }, 3000);
  
  setTimeout(() => {
    startJSONRepairMonitor();
  }, 5000);
}

// Funciones disponibles
window.simulateActualBrokenOutput = simulateActualBrokenOutput;
window.testRobustRepair = testRobustRepair;
window.startJSONRepairMonitor = startJSONRepairMonitor;
window.runAllTests = runAllTests;

console.log('🔧 Funciones de test disponibles:');
console.log('- simulateActualBrokenOutput()');
console.log('- testRobustRepair()');
console.log('- startJSONRepairMonitor()');
console.log('- runAllTests()');
console.log('');
console.log('💡 Recomendado: Ejecutar runAllTests()');
