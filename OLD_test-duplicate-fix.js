/**
 * PRUEBA DE CORRECCIÓN DE DUPLICACIÓN EN RESÚMENES FINALES
 * 
 * Este archivo prueba que la nueva lógica de detección de resúmenes finales
 * funciona correctamente para evitar duplicación de cantidades.
 */

// Simulación de la función de detección REFINADA
function isOrderFinalSummary(transcript) {
  const text = transcript.toLowerCase();
  
  // PATRONES PRIMARIOS: Frases de cierre/resumen que causan duplicación
  const finalSummaryPhrases = [
    'tu pedido está completo',
    'tu orden está completa',
    'tendrás',
    'tienes',
    '¿quieres que te lo empaquemos',
    'lo disfrutarás aquí',
    '¿para llevar o aquí',
    '¿empacado o aquí',
    'tu pedido incluye',
    'tu orden incluye',
    'esto es todo',
    'eso es todo'
  ];
  
  // VERIFICACIÓN 1: Frases directas de resumen final
  const hasResumenPhrase = finalSummaryPhrases.some(phrase => text.includes(phrase));
  
  if (hasResumenPhrase) {
    console.log(`🚫 RESUMEN FINAL detected: "${transcript.slice(0, 50)}..." - BLOQUEANDO addToCart`);
    return true;
  }
  
  // PATRÓN CRÍTICO REFINADO: Lista de productos SIN confirmaciones verbales
  const hasProductList = (text.includes(',') || text.includes(' y ')) && 
                        (text.includes('dona') || text.includes('café') || text.includes('jugo'));
  
  const hasConfirmationWords = text.includes('agregué') || text.includes('añadí') || 
                              text.includes('incluí') || text.includes('perfecto') ||
                              text.includes('genial') || text.includes('excelente') ||
                              text.includes('por ') || text.includes('con ') ||
                              text.includes('dólar') || text.includes('centavo');
  
  // VERIFICACIÓN 2: Lista de productos SIN confirmación (muy probable que sea resumen)
  if (hasProductList && !hasConfirmationWords) {
    console.log(`🚫 PRODUCT LIST detected (likely summary): "${transcript.slice(0, 50)}..." - BLOQUEANDO addToCart`);
    return true;
  }
  
  return false;
}

// CASOS DE PRUEBA
console.log('=== PRUEBAS DE DETECCIÓN DE RESÚMENES FINALES ===\n');

// Caso 1: El caso problemático específico del log
const case1 = "Mini donas surtidas, café latino y jugo de maracuyá.";
console.log('Caso 1:', case1);
console.log('Resultado:', isOrderFinalSummary(case1) ? '✅ BLOQUEADO' : '❌ NO BLOQUEADO');
console.log('');

// Caso 2: Resumen completo con frase de cierre
const case2 = "Tu pedido está completo. Tendrás mini donas surtidas, café latino y jugo de maracuyá. ¿Quieres que te lo empaquemos para llevar?";
console.log('Caso 2:', case2);
console.log('Resultado:', isOrderFinalSummary(case2) ? '✅ BLOQUEADO' : '❌ NO BLOQUEADO');
console.log('');

// Caso 3: Confirmación individual (NO debe bloquearse)
const case3 = "Perfecto, agregué una mini dona surtida por dos dólares con cuarenta y nueve centavos.";
console.log('Caso 3:', case3);
console.log('Resultado:', isOrderFinalSummary(case3) ? '❌ BLOQUEADO' : '✅ NO BLOQUEADO (correcto)');
console.log('');

// Caso 4: Sugerencia (NO debe bloquearse aquí, se bloquea en otra función)
const case4 = "¿Te gustaría agregar algo más como una dona o un jugo?";
console.log('Caso 4:', case4);
console.log('Resultado:', isOrderFinalSummary(case4) ? '❌ BLOQUEADO' : '✅ NO BLOQUEADO (correcto - se bloquea en isSuggestion)');
console.log('');

// Caso 5: Lista simple de productos sin contexto de resumen
const case5 = "Tenemos donas de chocolate, café latino y jugo de maracuyá disponibles.";
console.log('Caso 5:', case5);
console.log('Resultado:', isOrderFinalSummary(case5) ? '⚠️ BLOQUEADO (posible falso positivo)' : '✅ NO BLOQUEADO');
console.log('');

// Caso 6: Frase específica con "tendrás"
const case6 = "Tendrás una dona rellena de arequipe y un café latino.";
console.log('Caso 6:', case6);
console.log('Resultado:', isOrderFinalSummary(case6) ? '✅ BLOQUEADO' : '❌ NO BLOQUEADO');
console.log('');

console.log('=== RESUMEN ===');
console.log('✅ = Comportamiento correcto');
console.log('❌ = Comportamiento incorrecto');
console.log('⚠️ = Posible falso positivo (revisar si es necesario)');
