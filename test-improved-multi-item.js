// Test completo de las mejoras para múltiples items
console.log('🧪 Testing improved multi-item JSON repair...\n');

// Función de reparación JSON mejorada - COPIA EXACTA
const repairJSON = (jsonString) => {
  console.log('🔧 Starting JSON repair for:', jsonString.slice(0, 100) + '...');
  
  // Caso 1: [name": "Dona old fashioned", ... -> [{"name": "Dona old fashioned", ...
  if (jsonString.startsWith('[name"')) {
    jsonString = '[{"name"' + jsonString.slice(6);
    console.log('🔧 Fixed Case 1 - Added missing opening brace:', jsonString.slice(0, 50) + '...');
  }
  
  // Caso 2: name": "Dona old fashioned", ... -> [{"name": "Dona old fashioned", ...
  else if (jsonString.startsWith('name"')) {
    jsonString = '[{"name"' + jsonString.slice(5);
    console.log('🔧 Fixed Case 2 - Added array and opening brace:', jsonString.slice(0, 50) + '...');
  }
  
  // Caso 3: Verificar que cada objeto tenga llaves de apertura correctas
  // Buscar patrones como }, "name": y convertir a }, {"name":
  const beforeSeparatorFix = jsonString;
  jsonString = jsonString.replace(/},\s*"name":/g, '}, {"name":');
  if (beforeSeparatorFix !== jsonString) {
    console.log('🔧 Fixed object separators for multiple items');
  }
  
  // Caso 4: Arreglar objetos que faltan llaves de apertura en el medio
  // Patrón: "name": sin { antes
  jsonString = jsonString.replace(/([^\{])\s*"name"\s*:/g, '$1{"name":');
  
  // Caso 5: Asegurar que termine correctamente
  if (!jsonString.endsWith('}]') && !jsonString.endsWith(']')) {
    if (jsonString.endsWith('}')) {
      jsonString += ']';
      console.log('🔧 Added missing closing bracket');
    } else {
      jsonString += '}]';
      console.log('🔧 Added missing closing brace and bracket');
    }
  }
  
  // Caso 6: Si falta el último cierre de objeto antes del bracket
  if (jsonString.endsWith(']') && !jsonString.includes('}]')) {
    jsonString = jsonString.slice(0, -1) + '}]';
    console.log('🔧 Added missing closing brace before bracket');
  }
  
  // Validación adicional: asegurar que el JSON tenga la estructura correcta
  try {
    const parsed = JSON.parse(jsonString);
    console.log(`✅ JSON repair successful - ${Array.isArray(parsed) ? parsed.length : 'non-array'} items`);
    return jsonString;
  } catch (error) {
    console.log('❌ JSON still invalid after repair, attempting advanced repair...');
    console.log('❌ Failed JSON:', jsonString.slice(0, 200) + '...');
    
    // Reparación avanzada: reconstruir desde cero si es necesario
    const advancedRepair = attemptAdvancedRepair(jsonString);
    return advancedRepair;
  }
};

// Función de reparación avanzada mejorada
const attemptAdvancedRepair = (brokenJson) => {
  console.log('🔧 Attempting advanced JSON repair for:', brokenJson.slice(0, 200) + '...');
  
  try {
    // Patrón mejorado para extraer items que puede manejar múltiples items
    const itemPattern = /"name"\s*:\s*"([^"]+)"[^}]*?"quantity"\s*:\s*(\d+)[^}]*?"price"\s*:\s*([\d.]+)/g;
    const items = [];
    let match;
    
    // Reset regex para buscar desde el inicio
    itemPattern.lastIndex = 0;
    
    while ((match = itemPattern.exec(brokenJson)) !== null) {
      items.push({
        name: match[1],
        quantity: parseInt(match[2]),
        price: parseFloat(match[3])
      });
      console.log(`🔍 Extracted item ${items.length}:`, items[items.length - 1]);
    }
    
    if (items.length > 0) {
      const repairedJson = JSON.stringify(items);
      console.log(`✅ Advanced repair successful, extracted ${items.length} items:`, items.map(i => i.name));
      return repairedJson;
    }
    
    // Si no encuentra items con el patrón estricto, intentar un patrón más flexible
    console.log('🔍 Trying flexible item extraction...');
    const flexiblePattern = /"([^"]*(?:dona|donut|café|coffee|americano)[^"]*)"\s*[^}]*?(\d+)[^}]*?([\d.]+)/gi;
    flexiblePattern.lastIndex = 0;
    
    const flexibleItems = [];
    while ((match = flexiblePattern.exec(brokenJson)) !== null) {
      // Inferir si es un item válido basado en el contenido
      const nameCandidate = match[1].toLowerCase();
      if (nameCandidate.includes('dona') || nameCandidate.includes('donut') || 
          nameCandidate.includes('café') || nameCandidate.includes('coffee') ||
          nameCandidate.includes('americano')) {
        
        flexibleItems.push({
          name: match[1],
          quantity: parseInt(match[2]),
          price: parseFloat(match[3])
        });
        console.log(`🔍 Flexibly extracted item:`, flexibleItems[flexibleItems.length - 1]);
      }
    }
    
    if (flexibleItems.length > 0) {
      const repairedJson = JSON.stringify(flexibleItems);
      console.log(`✅ Flexible repair successful, extracted ${flexibleItems.length} items`);
      return repairedJson;
    }
    
  } catch (error) {
    console.error('❌ Advanced repair failed:', error);
  }
  
  // Si todo falla, devolver un array vacío válido
  console.log('⚠️ All repair attempts failed, returning empty array');
  return '[]';
};

// TESTS ESPECÍFICOS PARA EL PROBLEMA REPORTADO

console.log('=== Test 1: JSON malformado de los logs (caso real) ===');
const realBrokenJson = '[name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}]';

try {
  const repaired = repairJSON(realBrokenJson);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Parsed result:', parsed);
  console.log(`Items found: ${parsed.length}`);
  parsed.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} - $${item.price} (qty: ${item.quantity})`);
  });
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n=== Test 2: Múltiples items con JSON parcialmente malformado ===');
const multiItemBrokenJson = '[name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}, {"name": "Café americano regular", "quantity": 1, "price": 1.79}]';

try {
  const repaired = repairJSON(multiItemBrokenJson);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Parsed result:', parsed);
  console.log(`Items found: ${parsed.length}`);
  parsed.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} - $${item.price} (qty: ${item.quantity})`);
  });
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n=== Test 3: JSON completamente roto que requiere reparación avanzada ===');
const veryBrokenJson = 'name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09 name": "Café americano regular", "quantity": 1, "price": 1.79';

try {
  const repaired = repairJSON(veryBrokenJson);
  const parsed = JSON.parse(repaired);
  console.log('✅ SUCCESS! Parsed result:', parsed);
  console.log(`Items found: ${parsed.length}`);
  parsed.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} - $${item.price} (qty: ${item.quantity})`);
  });
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n=== Test 4: Simulación de buffer parcial (como en los logs) ===');
const partialBufferJson = 'donut menu ORDER [name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}, {"name": "Café americano regular", "quantity": 1, "price": 1.79}] more text';

try {
  // Simular la detección de JSON parcial
  const partialJsonRegex = /\[(?:[^[\]]*"name"\s*:\s*"[^"]*"[^[\]]*"quantity"\s*:\s*\d+[^[\]]*"price"\s*:\s*[\d.]+[^[\]]*)+\]/s;
  const partialMatch = partialBufferJson.match(partialJsonRegex);
  
  if (partialMatch) {
    console.log('🎯 Found partial JSON in buffer:', partialMatch[0]);
    const repaired = repairJSON(partialMatch[0]);
    const parsed = JSON.parse(repaired);
    console.log('✅ SUCCESS! Parsed result:', parsed);
    console.log(`Items found: ${parsed.length}`);
    parsed.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - $${item.price} (qty: ${item.quantity})`);
    });
  } else {
    console.log('❌ No partial JSON found in buffer');
  }
} catch (error) {
  console.error('❌ FAILED:', error.message);
}

console.log('\n🏁 All tests completed!');
