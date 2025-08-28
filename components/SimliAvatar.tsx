'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SimliClient } from 'simli-client';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Estados del avatar para ahorrar créditos de Simli
type AvatarState = 'static' | 'active' | 'ended';

interface SimliAvatarProps {
  onReady?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  vapiInstance?: any;
  isCallActive?: boolean;
  avatarState?: AvatarState; // Nuevo prop para controlar el estado
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onReady,
  onError,
  className,
  vapiInstance,
  isCallActive,
  avatarState = 'static' // Por defecto empieza en estático
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const simliClientRef = useRef<SimliClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [simliInitialized, setSimliInitialized] = useState(false);

  // EFECTO DE INICIALIZACIÓN: Asegurar estado limpio al montar
  useEffect(() => {
    console.log('🎭 SimliAvatar component mounted with state:', avatarState);
    // Asegurar que empezamos sin errores
    setErrorState(null);
    setIsLoading(false);
    setIsConnected(false);
    setSimliInitialized(false);
  }, [avatarState]);

  // Mute VAPI internal audio to use only Simli's audio
  const muteVapiInternalAudio = useCallback(() => {
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      if (audioElements[i].id !== "simli_audio") {
        audioElements[i].muted = true;
        console.log('🔇 Muted VAPI internal audio element');
      }
    }
  }, []);

  // Get audio track from VAPI and send to Simli
  const connectVapiAudioToSimli = useCallback(() => {
    if (!simliClientRef.current || !vapiInstance) {
      console.log('⚠️ Missing Simli client or VAPI instance, retrying...');
      setTimeout(connectVapiAudioToSimli, 100);
      return;
    }

    try {
      muteVapiInternalAudio();
      
      // Get Daily call object from VAPI
      const dailyCall = vapiInstance.getDailyCallObject();
      if (!dailyCall) {
        console.log('⚠️ No Daily call object available yet, retrying...');
        setTimeout(connectVapiAudioToSimli, 100);
        return;
      }

      const participants = dailyCall.participants();
      console.log('👥 Daily call participants:', Object.keys(participants));

      Object.values(participants).forEach((participant: any) => {
        console.log(`🎤 Checking participant: ${participant.user_name}`);
        
        if (participant.user_name === "Vapi Speaker") {
          console.log('🗣️ Found Vapi Speaker!');
          const audioTrack = participant.tracks?.audio?.track;
          
          if (audioTrack) {
            console.log('🎵 Audio track found, connecting to Simli...');
            simliClientRef.current!.listenToMediastreamTrack(audioTrack as MediaStreamTrack);
            console.log('✅ Audio track connected to Simli');
          } else {
            console.log('⚠️ No audio track found for Vapi Speaker, retrying...');
            setTimeout(connectVapiAudioToSimli, 500);
          }
        }
      });

    } catch (error) {
      console.error('❌ Error connecting VAPI audio to Simli:', error);
      setTimeout(connectVapiAudioToSimli, 500);
    }
  }, [vapiInstance, muteVapiInternalAudio]);

  // Setup VAPI event listeners for audio integration
  const setupVapiEventListeners = useCallback(() => {
    if (!vapiInstance) return;

    console.log('🎧 Setting up VAPI event listeners...');

    vapiInstance.on("call-start", () => {
      console.log('📞 VAPI call started - connecting audio to Simli');
      setIsConnected(true);
      setTimeout(connectVapiAudioToSimli, 1000);
    });

    vapiInstance.on("message", (message: any) => {
      if (message.type === "speech-update" && 
          message.status === "started" && 
          message.role === "user") {
        console.log('🗣️ User started speaking - clearing Simli buffer');
        simliClientRef.current?.ClearBuffer();
      }
    });

    vapiInstance.on("call-end", () => {
      console.log('📞 VAPI call ended');
      setIsConnected(false);
    });

  }, [vapiInstance, connectVapiAudioToSimli]);

  // NUEVA FUNCIÓN: Inicializar Simli solo cuando sea necesario
  const initializeSimli = useCallback(async () => {
    if (simliInitialized || simliClientRef.current) {
      console.log('✅ Simli already initialized, skipping...');
      return;
    }

    console.log('🎭 SimliAvatar: Starting Simli initialization...');
    setIsLoading(true);
    setErrorState(null);

    try {
      const simliApiKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY;
      const simliFaceId = process.env.NEXT_PUBLIC_SIMLI_FACE_ID;

      if (!simliApiKey || !simliFaceId) {
        throw new Error('Missing Simli API key or Face ID in .env.local');
      }

      console.log('🔐 SimliAvatar: API Key length:', simliApiKey.length);
      console.log('🎭 SimliAvatar: Face ID:', simliFaceId);

      // Wait for DOM elements
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!videoRef.current || !audioRef.current) {
        console.warn('🎭 SimliAvatar: DOM elements not ready, retrying...');
        setTimeout(initializeSimli, 200);
        return;
      }

      const client = new SimliClient();
      simliClientRef.current = client;

      // Event Listeners - MEJORADOS para evitar errores en desconexión normal
      const handleConnected = () => {
        console.log('✅ SimliAvatar: Connected successfully!');
        setIsLoading(false);
        setErrorState(null);
        setSimliInitialized(true);
        onReady?.();
        
        // Send initial audio data to wake up Simli
        const audioData = new Uint8Array(6000).fill(0);
        client.sendAudioData(audioData);
        console.log('🎵 Sent initial audio data to Simli');
      };

      const handleDisconnected = (reason?: any) => {
        console.log('📞 SimliAvatar: Disconnected', reason);
        
        // Solo mostrar error si no es una desconexión intencional
        if (avatarState === 'active') {
          console.log('⚠️ Unexpected disconnection during active state');
          setErrorState('Avatar disconnected unexpectedly');
        } else {
          console.log('✅ Normal disconnection - avatar going to static mode');
          // No establecer error durante desconexión normal
          setErrorState(null);
        }
      };

      const handleFailed = (err: any) => {
        const errorMessage = err?.message || 'Simli connection failed';
        console.error('❌ SimliAvatar: Failed:', errorMessage, err);
        
        // Solo establecer error si estamos en modo activo
        if (avatarState === 'active') {
          setErrorState(errorMessage);
          setIsLoading(false);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      };

      // Attach event listeners
      client.on('connected', handleConnected);
      client.on('disconnected', handleDisconnected);
      client.on('failed', handleFailed);

      // Configuration
      const config = {
        apiKey: simliApiKey,
        faceID: simliFaceId,
        videoRef: videoRef.current,
        audioRef: audioRef.current,
        handleSilence: false,
        maxSessionLength: 600000, // 10 minutes in milliseconds
        maxIdleTime: 60000, // 1 minute in milliseconds
        session_token: "", // Will be generated automatically by the client
        SimliURL: "", // Will use default Simli URL
        enableConsoleLogs: true, // Enable console logs for debugging
      };

      console.log('📋 SimliAvatar: Initializing with config...');
      await client.Initialize(config);
      console.log('✅ SimliAvatar: Initialize completed');

      console.log('🔌 SimliAvatar: Starting connection...');
      await client.start();
      console.log('✅ SimliAvatar: Started successfully');

    } catch (errCatch) {
      const errorInstance = errCatch instanceof Error ? errCatch : new Error(String(errCatch));
      console.error('❌ SimliAvatar: Critical error:', errorInstance.message, errCatch);
      setErrorState(errorInstance.message);
      setIsLoading(false);
      onError?.(errorInstance);
    }
  }, [simliInitialized, onReady, onError]);

  // NUEVA FUNCIÓN: Limpiar Simli para ahorrar créditos - MEJORADA
  const cleanupSimli = useCallback(() => {
    console.log('🧹 SimliAvatar: Cleaning up Simli connection...');
    if (simliClientRef.current) {
      try {
        simliClientRef.current.close();
        console.log('✅ SimliClient closed successfully');
      } catch (cleanupError) {
        console.error('❌ Error during cleanup:', cleanupError);
        // NO establecer error state durante cleanup normal
      }
      simliClientRef.current = null;
    }
    setSimliInitialized(false);
    setIsConnected(false);
    setIsLoading(false);
    // IMPORTANTE: NO establecer errorState durante cleanup normal
    // Solo limpiar el error si existe
    if (errorState) {
      setErrorState(null);
    }
  }, [errorState]);

  // EFECTO PRINCIPAL: Manejar cambios de estado del avatar - MEJORADO
  useEffect(() => {
    console.log('🎭 Avatar state changed to:', avatarState);

    switch (avatarState) {
      case 'static':
        // Estado inicial o final - solo imagen estática
        console.log('🎭 Switching to static mode - cleaning up Simli and clearing errors');
        cleanupSimli();
        // IMPORTANTE: Limpiar cualquier error al volver a static
        setErrorState(null);
        setIsLoading(false);
        break;
        
      case 'active':
        // Activar Simli solo cuando sea necesario
        console.log('🎭 Switching to active mode - initializing Simli if needed');
        if (!simliInitialized && !errorState) {
          initializeSimli();
        }
        break;
        
      case 'ended':
        // Volver al estado estático después de un breve delay
        console.log('🎭 Call ended - will return to static mode');
        cleanupSimli();
        setErrorState(null); // Limpiar errores
        // Cambiar a static después de un delay
        setTimeout(() => {
          console.log('🎭 Transitioning from ended to static');
        }, 1000);
        break;
    }
  }, [avatarState, initializeSimli, cleanupSimli, simliInitialized, errorState]);

  // Setup VAPI event listeners when vapiInstance is available and avatar is active
  useEffect(() => {
    if (vapiInstance && avatarState === 'active') {
      setupVapiEventListeners();
    }
  }, [vapiInstance, setupVapiEventListeners, avatarState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSimli();
    };
  }, [cleanupSimli]);

  // Expose for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).getSimliInstance = () => simliClientRef.current;
      (window as any).testSimliTTS = async (text?: string) => {
        if (simliClientRef.current) {
          const testText = text || "Hola, bienvenido a Doctor Donut. ¿Qué deliciosas donas puedo prepararte hoy?";
          console.log('🧪 Testing Simli with text:', testText);
          try {
            // Send some test audio data since sendTextMessage doesn't exist
            const audioData = new Uint8Array(6000).fill(0);
            simliClientRef.current.sendAudioData(audioData);
            console.log('✅ Test audio data sent to Simli successfully');
            console.log('ℹ️ Note: Text-to-speech is handled by VAPI, not directly by Simli');
          } catch (error) {
            console.error('❌ Error testing Simli:', error);
          }
        } else {
          console.warn('⚠️ Simli instance not available');
        }
      };
      (window as any).connectVapiToSimli = () => {
        console.log('🧪 Manual VAPI-Simli connection test');
        connectVapiAudioToSimli();
      };
    }
  }, [connectVapiAudioToSimli]);

  // RENDERIZADO CONDICIONAL BASADO EN EL ESTADO - MEJORADO
  const containerClasses = cn(
    "relative rounded-xl overflow-hidden",
    "border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.3)]",
    "w-full aspect-[4/5]",
    className
  );

  // ERROR STATE - Solo mostrar si hay error Y estamos en modo activo
  if (errorState && avatarState === 'active') {
    return (
      <div className={cn(containerClasses, "bg-red-900/20 border-red-500/30")}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-red-400 text-center">
            <p className="text-lg font-semibold">Error del Avatar</p>
            <p className="text-sm mt-2">{errorState}</p>
            <p className="text-xs mt-2 text-gray-400">
              Verifica las claves de API de Simli en .env.local
            </p>
            <button 
              onClick={() => {
                console.log('🔄 Reloading page from error state');
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Recargar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATIC STATE - Mostrar imagen estática (PRIORIDAD)
  if (avatarState === 'static' || avatarState === 'ended') {
    return (
      <div className={cn(containerClasses, "bg-gradient-to-br from-gray-900 to-black")}>
        <div className="relative w-full h-full">
          <Image
            src="/avatarfp2.jpeg"
            alt="Virtual Assistant Avatar"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              console.error('❌ Error loading static avatar image');
              // Solo establecer error si el componente está montado
              // No establecer error para imágenes estáticas
            }}
          />
          
          {/* Overlay con información */}
          <div className="absolute inset-0 bg-black/20">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white text-sm font-medium">
                  👋 ¡Hola! Soy Natalia, tu asistente virtual
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  {avatarState === 'static' 
                    ? 'Presiona "Iniciar Orden" para comenzar' 
                    : '¡Gracias por tu visita! Vuelve pronto 😊'}
                </p>
              </div>
            </div>
          </div>

          {/* Visual effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE STATE - Mostrar avatar de Simli activo
  return (
    <div className={cn(containerClasses, "bg-black")}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cyan-400 text-sm">Activando Avatar...</p>
            <p className="text-xs text-gray-400">Conectando con Natalia...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
        id="simli_video"
        className="w-full h-full object-contain bg-black"
        onLoadedMetadata={(e) => {
          const target = e.target as HTMLVideoElement;
          console.log('📹 Video cargado:', target.videoWidth, 'x', target.videoHeight);
        }}
        onPlay={() => console.log('▶️ Video reproduciendo')}
        onError={(e) => {
          const error = (e.target as HTMLVideoElement).error;
          console.error('❌ Video error:', error);
          setErrorState(`Video error: ${error?.message || 'Unknown'}`);
        }}
      />
      
      <audio
        ref={audioRef}
        autoPlay
        id="simli_audio"
        className="hidden"
        onPlay={() => console.log('🔊 Audio reproduciendo')}
        onError={(e) => {
          const error = (e.target as HTMLAudioElement).error;
          console.error('❌ Audio error:', error);
        }}
      />

      {/* Status indicators */}
      <div className="absolute top-2 left-2 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
        <span className={`text-xs font-medium ${isConnected ? 'text-green-400' : isLoading ? 'text-yellow-400' : 'text-gray-400'}`}>
          {isConnected ? 'Live' : isLoading ? 'Activating...' : 'Ready'}
        </span>
      </div>

      {isCallActive && isConnected && (
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-medium text-red-400">
            Recording
          </span>
        </div>
      )}
      
      {/* Visual effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      </div>
    </div>
  );
};
