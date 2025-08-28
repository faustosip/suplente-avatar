/**
 * PRUEBA SIMPLE - VERIFICAR FLUJO SIMPLIFICADO
 * 
 * Este script simula el comportamiento correcto después de la simplificación
 */

// Mock del carrito global
global.window = {
  currentOrder: [],
  dispatchEvent: (event) => {
    console.log(`📡 EVENT DISPATCHED: ${event.type}`, event.detail);
  }
};

// Simulación de la función addToCart simplificada
function addToCart(newItems) {
  if (!window.currentOrder) {
    window.currentOrder = [];
  }
  
  console.log('🛒 Current cart before adding:', window.currentOrder);
  console.log('🛒 Items to add from updateOrder:', newItems);
  
  for (const newItem of newItems) {
    const existingItemIndex = window.currentOrder.findIndex(
      item => item.name === newItem.name && item.price === newItem.price
    );
    
    if (existingItemIndex >= 0) {
      // SETEAR la cantidad (no incrementar) porque updateOrder maneja cantidades correctas
      window.currentOrder[existingItemIndex].quantity = newItem.quantity;
      console.log(`🔄 Updated existing item: ${newItem.name} (quantity: ${newItem.quantity})`);
    } else {
      window.currentOrder.push({...newItem});
      console.log(`➕ Added new item to cart: ${newItem.name} ($${newItem.price})`);
    }
  }
  
  console.log('🛒 Updated cart:', window.currentOrder);
  
  // Dispatch el carrito completo
  window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
    detail: JSON.stringify(window.currentOrder)
  }));
  
  return window.currentOrder;
}

// Simulación de mensajes de VAPI
function simulateVapiMessage(message) {
  console.log('📩 VAPI Message received:', message.type);
  
  // ÚNICA FUENTE: updateOrder function calls
  if (message.type === 'function-call' && message.functionCall?.name === 'updateOrder') {
    console.log('🔧 FUNCTION CALL DETECTED - ÚNICA FUENTE DE PRODUCTOS');
    
    try {
      const orderData = message.functionCall.parameters.orderDetailsData;
      console.log('📋 Order data from updateOrder:', orderData);
      
      if (Array.isArray(orderData) && orderData.length > 0) {
        const updatedCart = addToCart(orderData);
        console.log('✅ updateOrder processed successfully');
        return updatedCart;
      }
    } catch (error) {
      console.error('❌ Error processing updateOrder:', error);
    }
  }
  
  // Solo logging de transcripts
  if (message.type === 'transcript') {
    console.log(`📝 Transcript logged: ${message.transcript}`);
    console.log('ℹ️ NO procesamiento de productos - solo updateOrder');
  }
}

console.log('=== PRUEBA DEL FLUJO SIMPLIFICADO ===\n');

// Escenario 1: Primera orden
console.log('🎬 ESCENARIO 1: Primera orden via updateOrder');
simulateVapiMessage({
  type: 'function-call',
  functionCall: {
    name: 'updateOrder',
    parameters: {
      orderDetailsData: [
        {name: "Dona glaseada de chocolate", quantity: 1, price: 1.09}
      ]
    }
  }
});
console.log('');

// Escenario 2: Transcript del asistente (NO debe procesar)
console.log('🎬 ESCENARIO 2: Transcript del asistente');
simulateVapiMessage({
  type: 'transcript',
  transcript: 'Perfecto, agregué una dona glaseada de chocolate por un dólar con nueve centavos.'
});
console.log('');

// Escenario 3: Segunda orden via updateOrder
console.log('🎬 ESCENARIO 3: Segunda orden via updateOrder');
simulateVapiMessage({
  type: 'function-call',
  functionCall: {
    name: 'updateOrder',
    parameters: {
      orderDetailsData: [
        {name: "Dona glaseada de chocolate", quantity: 1, price: 1.09},
        {name: "Café latino", quantity: 1, price: 1.99}
      ]
    }
  }
});
console.log('');

// Escenario 4: Resumen del asistente (NO debe procesar)
console.log('🎬 ESCENARIO 4: Resumen del asistente');
simulateVapiMessage({
  type: 'transcript',
  transcript: 'Tu pedido está completo. Tendrás una dona glaseada de chocolate y un café latino.'
});
console.log('');

console.log('=== CARRITO FINAL ===');
console.log('Productos en carrito:', window.currentOrder);
console.log(`Total de productos únicos: ${window.currentOrder.length}`);

const expectedItems = 2; // Dona y Café
const actualItems = window.currentOrder.length;

if (actualItems === expectedItems) {
  console.log('✅ PRUEBA EXITOSA: No hay duplicación');
} else {
  console.log(`❌ PRUEBA FALLIDA: Se esperaban ${expectedItems} items, se encontraron ${actualItems}`);
}
