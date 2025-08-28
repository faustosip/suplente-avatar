// Environment configuration and validation
export const config = {
  // VAPI Configuration
  vapi: {
    publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '',
    privateKey: process.env.VAPI_PRIVATE_KEY || '',
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',
  },
  
  // Simli Configuration
  simli: {
    apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY || '',
    faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID || '',
  },
  
  // App Configuration
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    name: 'Dr. Donut Drive-Thru',
    version: '1.0.0',
  },
  
  // Features Configuration
  features: {
    enableStats: process.env.NEXT_PUBLIC_ENABLE_STATS !== 'false',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableMenu: process.env.NEXT_PUBLIC_ENABLE_MENU !== 'false',
    debugMode: process.env.NODE_ENV === 'development',
  },

  // Timeouts and Limits
  timeouts: {
    vapiConnection: 30000, // 30 seconds
    simliConnection: 45000, // 45 seconds
    orderTimeout: 600000, // 10 minutes
  },

  // Order Configuration
  order: {
    maxItems: 20,
    maxItemQuantity: 10,
    taxRate: 0.08, // 8% tax
  }
};

// Validation functions
export const validateConfig = () => {
  const errors: string[] = [];

  // VAPI validation
  if (!config.vapi.publicKey) {
    errors.push('NEXT_PUBLIC_VAPI_PUBLIC_KEY is required');
  }
  if (!config.vapi.assistantId) {
    errors.push('NEXT_PUBLIC_VAPI_ASSISTANT_ID is required');
  }
  if (config.vapi.publicKey && !config.vapi.publicKey.startsWith('pk_')) {
    errors.push('VAPI public key should start with "pk_"');
  }

  // Simli validation
  if (!config.simli.apiKey) {
    errors.push('NEXT_PUBLIC_SIMLI_API_KEY is required');
  }
  if (!config.simli.faceId) {
    errors.push('NEXT_PUBLIC_SIMLI_FACE_ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get configuration status
export const getConfigStatus = () => {
  const validation = validateConfig();
  
  return {
    ...validation,
    vapi: {
      configured: !!(config.vapi.publicKey && config.vapi.assistantId),
      publicKeyLength: config.vapi.publicKey.length,
      assistantIdLength: config.vapi.assistantId.length,
    },
    simli: {
      configured: !!(config.simli.apiKey && config.simli.faceId),
      apiKeyLength: config.simli.apiKey.length,
      faceIdLength: config.simli.faceId.length,
    },
    features: config.features,
  };
};

// Log configuration status (development only)
if (config.features.debugMode) {
  console.log('🔧 Configuration Status:', getConfigStatus());
}

export default config;
