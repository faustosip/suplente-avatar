// Global Event Debug Logger
if (typeof window !== 'undefined') {
  console.log('🔧 Setting up global event debugging...');
  
  // Original addEventListener
  const originalAddEventListener = window.addEventListener;
  const originalDispatchEvent = window.dispatchEvent;
  
  // Override addEventListener to log all event listeners
  window.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
    if (type === 'orderDetailsUpdated' || type === 'testOrderUpdate') {
      console.log(`📡 EVENT LISTENER ADDED: ${type}`);
    }
    return originalAddEventListener.call(this, type, listener as EventListenerOrEventListenerObject, options);
  };
  
  // Override dispatchEvent to log all dispatched events
  window.dispatchEvent = function(event: Event) {
    if (event.type === 'orderDetailsUpdated' || event.type === 'testOrderUpdate') {
      console.log(`🚀 EVENT DISPATCHED: ${event.type}`, (event as CustomEvent).detail);
    }
    return originalDispatchEvent.call(this, event);
  };
  
  console.log('✅ Global event debugging enabled');
}