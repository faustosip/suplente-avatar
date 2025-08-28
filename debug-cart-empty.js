/**
 * DEBUGGING: PROBLEMA DE CARRITO VACÍO
 * 
 * Análisis de los logs para identificar por qué no se agregan productos al carrito
 */

console.log('=== ANÁLISIS DE LOS LOGS ===\n');

// Simulación de los mensajes que vemos en los logs
const logMessages = [
  {
    type: 'transcript',
    role: 'assistant', 
    transcript: 'Agregué una dona rellena de arequipe por un dólar con 29 centavos.'
  },
  {
    type: 'tool-calls',
    toolCalls: [
      {
        function: {
          name: 'updateOrder',
          arguments: JSON.stringify({
            orderDetailsData: [
              {name: "Dona rellena de arequipe", quantity: 1, price: 1.29}
            ]
          })
        }
      }
    ]
  },
  {
    type: 'model-output',
    output: '[object Object]'
  }
];

// Función para procesar mensajes (como en el código real)
function processVapiMessage(message) {
  console.log('📩 Processing message type:', message.type);
  
  // CAPTURAR TOOL-CALLS (formato que VAPI está usando)
  if (message.type === 'tool-calls' && message.toolCalls && Array.isArray(message.toolCalls)) {
    console.log('🔧 TOOL-CALLS DETECTED:', JSON.stringify(message.toolCalls, null, 2));
    
    for (const toolCall of message.toolCalls) {
      if (toolCall.function?.name === 'updateOrder') {
        try {
          const parameters = typeof toolCall.function.arguments === 'string' 
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments;
          
          const orderData = parameters.orderDetailsData;
          console.log('📋 Order data from tool-calls updateOrder:', orderData);
          
          if (Array.isArray(orderData) && orderData.length > 0) {
            console.log('✅ PRODUCTOS ENCONTRADOS - AGREGANDO AL CARRITO');
            console.log('Productos a agregar:', orderData);
            return orderData;
          }
        } catch (error) {
          console.error('❌ Error processing tool-calls updateOrder:', error);
        }
      }
    }
  }
  
  // CAPTURAR FUNCTION-CALLS (formato original)
  if (message.type === 'function-call' && message.functionCall?.name === 'updateOrder') {
    console.log('🔧 FUNCTION CALL DETECTED');
    // Similar processing...
  }
  
  // Solo logging de transcripts
  if (message.type === 'transcript' && message.role === 'assistant') {
    console.log(`📝 Transcript logged: ${message.transcript}`);
    console.log('ℹ️ NO procesamiento de productos - solo logging');
  }
  
  return null;
}

console.log('🎬 SIMULANDO PROCESAMIENTO DE MENSAJES:\n');

let productosAgregados = [];

for (const message of logMessages) {
  const productos = processVapiMessage(message);
  if (productos) {
    productosAgregados.push(...productos);
  }
  console.log('---');
}

console.log('\n=== RESULTADO ===');
console.log('Productos que deberían estar en el carrito:', productosAgregados);

if (productosAgregados.length > 0) {
  console.log('✅ CORRECCIÓN FUNCIONARÁ: tool-calls están siendo capturados');
} else {
  console.log('❌ PROBLEMA PERSISTE: Verificar configuración de VAPI');
  console.log('\n🔧 POSIBLES SOLUCIONES:');
  console.log('1. Verificar que updateOrder esté configurado en VAPI dashboard');
  console.log('2. Revisar que el asistente tenga permisos para hacer function calls');
  console.log('3. Verificar formato exacto de los tool-calls en logs reales');
}

console.log('\n=== PASOS PARA VERIFICAR EN VAPI DASHBOARD ===');
console.log('1. Ir a https://dashboard.vapi.ai');
console.log('2. Seleccionar el asistente (a5b5d9b1...)');
console.log('3. Verificar que existe la función "updateOrder" en Functions/Tools');
console.log('4. Verificar que tiene el schema correcto para orderDetailsData');
console.log('5. Verificar que está marcada como "enabled"');
