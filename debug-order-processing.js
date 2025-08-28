// Script para debuggear el procesamiento de órdenes
// Este script simula el procesamiento que se hace en useVapi.ts

console.log('🔍 Testing order processing...\n');

// Función para reparar JSON de useVapi.ts
function repairJSON(jsonString) {
    console.log('📝 Original JSON:', jsonString);
    
    // REPARACIÓN ROBUSTA DEL JSON
    if (!jsonString.includes('{"')) {
        // Caso 1: [name": -> [{"name":
        if (jsonString.startsWith('[name"')) {
            jsonString = jsonString.replace('[name"', '[{"name"');
            console.log('🔧 Fixed missing opening brace:', jsonString);
        }
        // Caso 2: name": -> [{"name":
        else if (jsonString.startsWith('name"')) {
            jsonString = '[{"' + jsonString;
            console.log('🔧 Added missing array and brace:', jsonString);
        }
    }
    
    // Reparar cierre si falta
    if (!jsonString.includes('}]')) {
        if (jsonString.endsWith(']')) {
            jsonString = jsonString.slice(0, -1) + '}]';
            console.log('🔧 Fixed missing closing brace:', jsonString);
        } else if (!jsonString.endsWith('}]')) {
            jsonString += '}]';
            console.log('🔧 Added missing closing:', jsonString);
        }
    }
    
    console.log('✅ Final repaired JSON:', jsonString);
    return jsonString;
}

// Función formatOrderData de utils.ts
function formatOrderData(orderDetailsData) {
    try {
        const parsedItems = JSON.parse(orderDetailsData);
        const totalAmount = parsedItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        return {
            items: parsedItems,
            totalAmount: Number(totalAmount.toFixed(2))
        };
    } catch (error) {
        console.error('❌ Error parsing order data:', error);
        return {
            items: [],
            totalAmount: 0
        };
    }
}

// Test cases basados en la conversación de los logs
console.log('=== Test Case 1: Orden completa con 3 items ===');
const fullOrder = `[
    {"name": "Dona glaseada con especias de calabaza", "quantity": 1, "price": 1.29},
    {"name": "Latte", "quantity": 1, "price": 3.49},
    {"name": "Café Americano", "quantity": 1, "price": 1.79}
]`;

try {
    const result1 = formatOrderData(fullOrder);
    console.log('✅ Resultado:', result1);
    console.log(`   Items: ${result1.items.length}`);
    console.log(`   Total: $${result1.totalAmount}`);
} catch (error) {
    console.error('❌ Error:', error);
}

console.log('\n=== Test Case 2: JSON parcialmente roto ===');
const brokenOrder1 = `[name": "Dona glaseada con especias de calabaza", "quantity": 1, "price": 1.29}]`;

try {
    const repaired1 = repairJSON(brokenOrder1);
    const result2 = formatOrderData(repaired1);
    console.log('✅ Resultado:', result2);
} catch (error) {
    console.error('❌ Error:', error);
}

console.log('\n=== Test Case 3: Array con múltiples items roto ===');
const brokenOrder2 = `[{"name": "Dona glaseada con especias de calabaza", "quantity": 1, "price": 1.29}, {"name": "Latte", "quantity": 1, "price": 3.49`;

try {
    const repaired2 = repairJSON(brokenOrder2);
    const result3 = formatOrderData(repaired2);
    console.log('✅ Resultado:', result3);
} catch (error) {
    console.error('❌ Error:', error);
}

console.log('\n=== Test Case 4: Simulando fragmentación como en los logs ===');
// Simular lo que se ve en los logs donde llegan fragmentos
const fragments = ['ORDER', '[', 'name', '": "Dona glaseada', '", "quantity": 1', ', {"name": "Latte"'];
let buffer = '';

fragments.forEach((fragment, index) => {
    buffer += fragment;
    console.log(`Fragment ${index + 1}: "${fragment}"`);
    console.log(`Buffer: "${buffer}"`);
    
    // Buscar marcadores completos
    const orderUpdateRegex = /<!--ORDER_UPDATE-->\s*(\[.*?\])\s*<!--\/ORDER_UPDATE-->/s;
    const match = buffer.match(orderUpdateRegex);
    
    if (match) {
        console.log('🎯 ORDER_UPDATE marker found!', match[1]);
    }
});

console.log('\n🏁 Debugging complete');
