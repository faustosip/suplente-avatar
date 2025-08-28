// Test de las nuevas mejoras para detección múltiple y reconstrucción
console.log('🧪 Testing enhanced multi-item detection and reconstruction...\n');

// TEST 1: Reconstrucción inteligente desde buffer de texto
console.log('=== Test 1: Intelligent JSON reconstruction from text buffer ===');

function testIntelligentReconstruction(buffer) {
  console.log('🔧 Testing buffer:', buffer.slice(0, 100) + '...');
  
  const itemMentions = [];
  
  // Buscar donas
  const donaPattern = /(dona|donut)[^.]*?(?:glaseada?|chocolate|azúcar|crema|mermelada|sprinkles|old\s+fashioned)/gi;
  const donaMatches = buffer.match(donaPattern);
  if (donaMatches) {
    donaMatches.forEach(match => {
      console.log('🍩 Found dona mention:', match);
      if (match.toLowerCase().includes('chocolate')) {
        itemMentions.push({name: "Dona glaseada de chocolate", quantity: 1, price: 1.09});
      }
    });
  }
  
  // Buscar cafés
  const cafePattern = /(café|coffee)[^.]*?(?:americano|regular|grande|latte|cappuccino)/gi;
  const cafeMatches = buffer.match(cafePattern);
  if (cafeMatches) {
    cafeMatches.forEach(match => {
      console.log('☕ Found cafe mention:', match);
      if (match.toLowerCase().includes('americano') && match.toLowerCase().includes('regular')) {
        itemMentions.push({name: "Café americano regular", quantity: 1, price: 1.79});
      }
    });
  }
  
  if (itemMentions.length > 0) {
    const reconstructedJson = JSON.stringify(itemMentions);
    console.log('✅ Reconstructed JSON:', reconstructedJson);
    return reconstructedJson;
  } else {
    console.log('❌ No items detected');
    return null;
  }
}

// Simular buffer problemático de los logs
const problematicBuffer = `
Perfecto, he añadido un café americano regular a tu pedido. 
Ahora tienes una dona glaseada de chocolate y un café americano regular. 
¿Algo más que te gustaría? Son Son, name, Son, name, dona glaseada 
Son, name, dona glaseada de chocolate, Guantety, 1, para 1, Price, 
OnePoint Sirve 1, Price, OnePoint Zero Unine, name, americano regular, 
Guante tipo Quantetip 1, price. OnePoint, Seven Nine, OnePoint Seven Nine.
`;

testIntelligentReconstruction(problematicBuffer);

console.log('\n=== Test 2: Multiple detection patterns ===');

// Test de múltiples patrones de detección
const patterns = [
  // Patrón original para arrays completos
  /\[(?:[^[\]]*"name"\s*:\s*"[^"]*"[^[\]]*"quantity"\s*:\s*\d+[^[\]]*"price"\s*:\s*[\d.]+[^[\]]*)+\]/s,
  
  // Patrón más agresivo para múltiples items
  /\[[\s\S]*?"name"\s*:\s*"[^"]*"[\s\S]*?"quantity"\s*:\s*\d+[\s\S]*?"price"\s*:\s*[\d.]+[\s\S]*?\]/s,
  
  // Patrón para detectar al menos UN item válido
  /"name"\s*:\s*"([^"]+)"[\s\S]*?"quantity"\s*:\s*(\d+)[\s\S]*?"price"\s*:\s*([\d.]+)/s,
];

const testStrings = [
  '[name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}, {"name": "Café americano regular", "quantity": 1, "price": 1.79}]',
  '[{"name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09}, name": "Café americano regular", "quantity": 1, "price": 1.79}]',
  'ORDER UPDATE [name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09} name": "Café americano regular", "quantity": 1, "price": 1.79',
  '"name": "Dona glaseada de chocolate", "quantity": 1, "price": 1.09 and some text "name": "Café americano regular", "quantity": 1, "price": 1.79',
];

testStrings.forEach((testString, index) => {
  console.log(`\n--- Testing string ${index + 1} ---`);
  console.log('Input:', testString.slice(0, 80) + '...');
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const match = testString.match(pattern);
    
    if (match) {
      console.log(`✅ Pattern ${i + 1} matched:`, match[0].slice(0, 100) + '...');
      break;
    }
  }
});

console.log('\n=== Test 3: Transcript analysis ===');

function testTranscriptAnalysis(transcript) {
  console.log('🎙️ Testing transcript:', transcript);
  
  const lowerTranscript = transcript.toLowerCase();
  
  // Solo procesar si menciona confirmación de items
  if ((lowerTranscript.includes('agregué') || lowerTranscript.includes('añadido') || 
       lowerTranscript.includes('tienes') || lowerTranscript.includes('pedido incluye')) &&
      (lowerTranscript.includes('dona') || lowerTranscript.includes('café'))) {
    
    console.log('✅ Transcript mentions order confirmation');
    
    const detectedItems = [];
    
    // Detectar donas mencionadas
    if (lowerTranscript.includes('dona') && lowerTranscript.includes('chocolate')) {
      detectedItems.push({name: "Dona glaseada de chocolate", quantity: 1, price: 1.09});
      console.log('🍩 Detected: Dona glaseada de chocolate');
    }
    
    // Detectar café americano
    if (lowerTranscript.includes('café') && lowerTranscript.includes('americano') && 
        lowerTranscript.includes('regular')) {
      detectedItems.push({name: "Café americano regular", quantity: 1, price: 1.79});
      console.log('☕ Detected: Café americano regular');
    }
    
    if (detectedItems.length >= 2) {
      console.log('🎯 Multiple items detected:', detectedItems);
      return detectedItems;
    } else {
      console.log('⚠️ Only single item or no items detected');
      return null;
    }
  } else {
    console.log('❌ Transcript does not mention order confirmation');
    return null;
  }
}

// Test transcripts reales de los logs
const testTranscripts = [
  "Perfecto, he añadido un café americano regular a tu pedido.",
  "Ahora tienes una dona glaseada de chocolate y un café americano regular.",
  "Tu pedido incluye una dona glaseada de chocolate y un café americano regular.",
  "¿Algo más que te gustaría?",
];

testTranscripts.forEach((transcript, index) => {
  console.log(`\n--- Transcript test ${index + 1} ---`);
  testTranscriptAnalysis(transcript);
});

console.log('\n🏁 Enhanced detection tests completed!');
