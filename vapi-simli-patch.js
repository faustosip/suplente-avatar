// Paste this code in the browser console for immediate debugging

console.log('🔧 Dr. Donut Debug Tools Loaded');

// Enhanced VAPI-Simli integration patch
if (window.location.hostname === 'localhost' && window.location.port === '3000') {
  
  // Patch VAPI to capture audio for Simli
  const originalVapiStart = window.Vapi?.prototype?.start;
  if (originalVapiStart) {
    window.Vapi.prototype.start = function(assistantId, options) {
      console.log('🎤 Patching VAPI for Simli audio capture...');
      
      // Call original start
      const result = originalVapiStart.call(this, assistantId, options);
      
      // Add audio capture listeners
      this.on('assistant-speech', (data) => {
        console.log('🗣️ Assistant speech detected:', data);
        window.dispatchEvent(new CustomEvent('vapiAssistantSpeech', { detail: data }));
      });
      
      this.on('audio-output', (audioData) => {
        console.log('🎵 Audio output detected:', audioData);
        window.dispatchEvent(new CustomEvent('vapiAudioData', { detail: audioData }));
      });
      
      return result;
    };
  }
  
  // Monitor all VAPI events
  window.vapiEventMonitor = (vapi) => {
    const events = [
      'call-start', 'call-end', 'speech-start', 'speech-end',
      'message', 'function-call', 'error', 'audio', 'transcript',
      'assistant-speech-start', 'assistant-speech-end'
    ];
    
    events.forEach(event => {
      vapi.on(event, (data) => {
        console.log(`📡 VAPI Event [${event}]:`, data);
        
        // Forward audio events to Simli
        if (event.includes('speech') || event.includes('audio')) {
          window.dispatchEvent(new CustomEvent(`vapi${event.charAt(0).toUpperCase() + event.slice(1)}`, {
            detail: data
          }));
        }
      });
    });
  };
  
  console.log('✅ VAPI audio patch applied for Simli integration');
  console.log('💡 Use: window.vapiEventMonitor(vapiInstance) to monitor all events');
}
