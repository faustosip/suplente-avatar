// Script de prueba para verificar las correcciones del JSON malformado
console.log('🧪 Testing JSON repair for the exact case from logs...\n');

// JSON Repair Function - COPIA de la función corregida
const repairJSON = (jsonString) => {
  console.log('🔧 Starting JSON repair for:', jsonString);
  
  // Caso 1: [name": "Dona old fashioned", ... -> [{"name": "Dona old fashioned", ...
  if (jsonString.startsWith('[name"')) {
    jsonString = '[{"name"' + jsonString.slice(6);
    console.log('🔧 Fixed Case 1 - Added missing opening brace:', jsonString);
  }
  
  // Caso 2: name": "Dona old fashioned", ... -> [{"name": "Dona old fashioned", ...
  else if (jsonString.startsWith('name"')) {
    jsonString = '[{"name"' + jsonString.slice(5);
    console.log('🔧 Fixed Case 2 - Added array and opening brace:', jsonString);
  }
  
  // Caso 3: Verificar que cada objeto tenga llaves de apertura correctas
  // Buscar patrones como }, "name": y convertir a }, {"name":
  jsonString = jsonString.replace(/},\s*"name":/g, '}, {"name":');
  console.log('🔧 Fixed object separators');
  
  // Caso 4: Asegurar que termine correctamente
  if (!jsonString.endsWith('}]') && !jsonString.endsWith(']')) {
    if (jsonString.endsWith('}')) {
      jsonString += ']';
      console.log('🔧 Added missing closing bracket');
    } else {
      jsonString += '}]';
      console.log('🔧 Added missing closing brace and bracket');
    }
  }
  
  // Caso 5: Si falta el último cierre de objeto antes del bracket
  if (jsonString.endsWith(']') && !jsonString.includes('}]')) {
    jsonString = jsonString.slice(0, -1) + '}]';
    console.log('🔧 Added missing closing brace before bracket');
  }
  
  // Validación adicional: asegurar que el JSON tenga la estructura correcta
  try {
    JSON.parse(jsonString);
    console.log('✅ JSON repair successful');
    return jsonString;
  } catch (error) {
    console.log('❌ JSON still invalid after repair, attempting advanced repair...');
    
    // Reparación avanzada: reconstruir desde cero si es necesario
    const advancedRepair = attemptAdvancedRepair(jsonString);
    return advancedRepair;
  }
};

// Advanced JSON Repair Function
const attemptAdvancedRepair = (brokenJson) => {
  console.log('🔧 Attempting advanced JSON repair');
  
  try {
    // Extraer información de items usando regex
    const itemPattern = /"name":\s*"([^"]+)"[^}]*"quantity":\s*(\d+)[^}]*"price":\s*([\d.]+)/g;
    const items = [];
    let match;
    
    while ((match = itemPattern.exec(brokenJson)) !== null) {
      items.push({
        name: match[1],
        quantity: parseInt(match[2]),
        price: parseFloat(match[3])
      });
    }
    
    if (items.length > 0) {
      const repairedJson = JSON.stringify(items);
      console.log('✅ Advanced repair successful, extracted', items.length, 'items');
      return repairedJson;
    }
  } catch (error) {
    console.error('❌ Advanced repair failed:', error);
  }
  
  // Si todo falla, devolver un array vacío válido
  console.log('⚠️ All repair attempts failed, returning empty array');
  return '[]';
};

// Test con el JSON exacto de los logs
console.log('=== Test 1: JSON exacto de los logs ===');
const brokenJsonFromLogs = '[name": "Dona old fashioned", "quantity": 1, "price": 1.29}, {"name": "Café americano regular", "quantity": 1, "price": 1.79}]';

try {
  const repaired = repairJSON(brokenJsonFromLogs);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Parsed result:', parsed);
  console.log(`Items found: ${parsed.length}`);
  parsed.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} - $${item.price} (qty: ${item.quantity})`);
  });
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n=== Test 2: Otro caso similar ===');
const anotherBrokenJson = '[name": "Latte", "quantity": 2, "price": 3.49}, {"name": "Donut", "quantity": 1, "price": 2.99}]';

try {
  const repaired = repairJSON(anotherBrokenJson);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Parsed result:', parsed);
  console.log(`Items found: ${parsed.length}`);
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n=== Test 3: JSON completamente corrupto ===');
const corruptJson = 'completely broken json {name: test';

try {
  const repaired = repairJSON(corruptJson);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Fallback result:', parsed);
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n🏁 Testing complete!');
