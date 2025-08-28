// Debug helper para Dr. Donut Drive-Thru
// Pegue este código en la consola del navegador para hacer debug

console.log('🔧 INICIANDO DEBUG DE DR. DONUT DRIVE-THRU');
console.log('==========================================\n');

// Helper functions para debug
window.drDonutDebug = {
  // 1. Verificar estado de Simli
  checkSimli: () => {
    const simliInstance = window.getSimliInstance?.();
    console.log('🎭 Estado de Simli:');
    console.log('- Instancia:', simliInstance ? 'Conectada' : 'No conectada');
    
    if (simliInstance) {
      console.log('- Cliente activo:', simliInstance);
    }
    
    // Verificar elementos de video/audio
    const video = document.querySelector('video');
    const audio = document.querySelector('audio');
    console.log('- Video element:', video ? 'Encontrado' : 'No encontrado');
    console.log('- Audio element:', audio ? 'Encontrado' : 'No encontrado');
    
    if (video) {
      console.log('- Video playing:', !video.paused);
      console.log('- Video dimensions:', video.videoWidth + 'x' + video.videoHeight);
    }
  },

  // 2. Verificar estado de VAPI
  checkVapi: () => {
    console.log('🗣️ Estado de VAPI:');
    
    // Buscar mensajes de VAPI en consola
    const logs = [];
    console.log('- Busca en la consola mensajes que empiecen con "VAPI:"');
    console.log('- Estado esperado: Connected, Call started');
  },

  // 3. Test de sincronización de audio
  testAudioSync: () => {
    console.log('🎵 Probando sincronización de audio...');
    
    // Disparar evento de audio manual
    window.dispatchEvent(new CustomEvent('vapiSpeechStart'));
    console.log('- Evento vapiSpeechStart disparado');
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('vapiSpeechEnd'));
      console.log('- Evento vapiSpeechEnd disparado');
    }, 2000);
    
    // Test de audio directo a Simli
    if (window.testSimliAudio) {
      window.testSimliAudio();
    } else {
      console.log('- Función testSimliAudio no disponible');
    }
  },

  // 4. Test de función updateOrder
  testOrderUpdate: () => {
    console.log('📋 Probando actualización de orden...');
    
    const testOrder = [
      {
        name: "DONA GLASEADA DE CHOCOLATE",
        quantity: 2,
        price: 1.09
      },
      {
        name: "CAFÉ AMERICANO REGULAR", 
        quantity: 1,
        price: 1.79
      }
    ];
    
    // Disparar evento de orden manual
    window.dispatchEvent(new CustomEvent('orderDetailsUpdated', {
      detail: JSON.stringify(testOrder)
    }));
    
    console.log('- Evento orderDetailsUpdated disparado con orden de prueba');
    console.log('- Orden de prueba:', testOrder);
    console.log('- Verifica si aparece en el panel derecho');
  },

  // 5. Verificar eventos
  monitorEvents: () => {
    console.log('👁️ Monitoreando eventos...');
    
    const events = [
      'orderDetailsUpdated',
      'vapiSpeechStart', 
      'vapiSpeechEnd',
      'vapiAudioData',
      'callEnded',
      'orderCompleted'
    ];
    
    events.forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        console.log(`🎯 Evento detectado: ${eventName}`, e.detail || '');
      });
    });
    
    console.log('- Monitoreando eventos:', events.join(', '));
    console.log('- Los eventos aparecerán en la consola cuando ocurran');
  },

  // 6. Información del sistema
  systemInfo: () => {
    console.log('💻 Información del sistema:');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Permisos de micrófono:', 'Verificar manualmente');
    console.log('- HTTPS:', location.protocol === 'https:' ? 'Sí' : 'No');
    console.log('- LocalHost:', location.hostname === 'localhost' ? 'Sí' : 'No');
    
    // Verificar APIs necesarias
    console.log('- MediaDevices API:', !!navigator.mediaDevices ? 'Disponible' : 'No disponible');
    console.log('- WebRTC:', !!window.RTCPeerConnection ? 'Disponible' : 'No disponible');
  },

  // 7. Reset completo
  resetSystem: () => {
    console.log('🔄 Reseteando sistema...');
    
    // Recargar la página
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },

  // 8. Ayuda
  help: () => {
    console.log('❓ COMANDOS DISPONIBLES:');
    console.log('========================');
    console.log('drDonutDebug.checkSimli()     - Verificar estado del avatar');
    console.log('drDonutDebug.checkVapi()      - Verificar estado de VAPI'); 
    console.log('drDonutDebug.testAudioSync()  - Probar sincronización de audio');
    console.log('drDonutDebug.testOrderUpdate() - Probar actualización de órdenes');
    console.log('drDonutDebug.monitorEvents()  - Monitorear eventos en tiempo real');
    console.log('drDonutDebug.systemInfo()     - Información del sistema');
    console.log('drDonutDebug.resetSystem()    - Reiniciar aplicación');
    console.log('drDonutDebug.help()           - Mostrar esta ayuda');
    console.log('\n💡 PASOS PARA TROUBLESHOOTING:');
    console.log('1. drDonutDebug.systemInfo()');
    console.log('2. drDonutDebug.checkSimli()');
    console.log('3. drDonutDebug.checkVapi()');
    console.log('4. drDonutDebug.monitorEvents()');
    console.log('5. Hablar por el micrófono y ver los logs');
    console.log('6. drDonutDebug.testOrderUpdate() si no aparecen órdenes');
  }
};

// Auto-inicializar debug
console.log('✅ Debug tools cargadas. Escriba: drDonutDebug.help()');
console.log('🎯 Para empezar: drDonutDebug.monitorEvents()');

// Auto-monitor de eventos críticos
window.drDonutDebug.monitorEvents();
