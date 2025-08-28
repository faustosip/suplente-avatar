'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { SimliAvatar } from '@/components/SimliAvatar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem';
import { StatsDisplay } from '@/components/StatsDisplay';
import { DebugPanel } from '@/components/DebugPanel';
import { SimliTestControls } from '@/components/SimliTestControls';
import { useVapi } from '@/hooks/useVapi';
import { ConnectionStatus } from '@/types';
import { Phone, PhoneOff, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriveThru() {
  const [isAvatarReady, setIsAvatarReady] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [avatarState, setAvatarState] = useState<'static' | 'active' | 'ended'>('static');
  
  // Notifications
  const { notifications, addNotification, removeNotification } = useNotifications();
  
  const { 
    connectionStatus, 
    error, 
    isLoading,
    startCall, 
    endCall, 
    vapi 
  } = useVapi();

  // NUEVO: Debug effect para verificar inicialización
  useEffect(() => {
    console.log('🚀 DriveThru component mounted - Environment check:');
    console.log({
      vapiKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? 'Present' : 'MISSING',
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? 'Present' : 'MISSING',
      simliKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY ? 'Present' : 'MISSING',
      faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID ? 'Present' : 'MISSING',
      isClient: typeof window !== 'undefined'
    });
  }, []);

  // Handle notification events
  useEffect(() => {
    const handleAddNotification = (event: CustomEvent) => {
      addNotification(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('addNotification', handleAddNotification as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('addNotification', handleAddNotification as EventListener);
      }
    };
  }, [addNotification]);

  // NUEVO: Manejar cambios de estado del avatar según el estado de la conexión
  useEffect(() => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTING:
        console.log('🎭 Avatar state: Activating for call...');
        setAvatarState('active');
        break;
      case ConnectionStatus.CONNECTED:
        console.log('🎭 Avatar state: Active and connected');
        setAvatarState('active');
        break;
      case ConnectionStatus.DISCONNECTED:
        // Solo cambiar a 'ended' si previamente estaba activo
        if (avatarState === 'active') {
          console.log('🎭 Avatar state: Call ended, returning to static');
          setAvatarState('ended');
          // Después de 3 segundos, volver al estado inicial para una nueva orden
          setTimeout(() => {
            console.log('🎭 Avatar state: Ready for new order');
            setAvatarState('static');
          }, 3000);
        }
        break;
      case ConnectionStatus.ERROR:
        console.log('🎭 Avatar state: Error, returning to static');
        setAvatarState('static');
        break;
    }
  }, [connectionStatus, avatarState]);

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Avatar callbacks - SIMPLIFIED
  const handleAvatarReady = useCallback(() => {
    console.log('🎭 DriveThru: Avatar is ready!');
    setIsAvatarReady(true);
  }, []);

  const handleAvatarError = useCallback((error: Error) => {
    console.error('🎭 DriveThru: Avatar error:', error.message);
    // NO bloquear el sistema si el avatar falla
    setIsAvatarReady(true); // Permitir que el sistema funcione sin avatar
  }, []);

  // Call management - FIXED: Simplificar lógica para que siempre funcione
  const handleCallToggle = useCallback(async () => {
    console.log('🎯 BUTTON CLICKED! Current status:', {
      connectionStatus,
      isAvatarReady,
      isLoading,
      avatarState,
      vapi: !!vapi
    });

    if (connectionStatus === ConnectionStatus.CONNECTED) {
      console.log('📞 Ending call...');
      endCall();
    } else if (connectionStatus === ConnectionStatus.DISCONNECTED || connectionStatus === ConnectionStatus.ERROR) {
      console.log('📞 Starting call...');
      // Intentar iniciar la llamada incluso si el avatar no está completamente listo
      // El avatar se activará automáticamente cuando VAPI se conecte
      try {
        await startCall();
        console.log('✅ startCall() executed successfully');
      } catch (error) {
        console.error('❌ Error starting call:', error);
      }
    } else {
      console.log('⚠️ Call not started - status:', connectionStatus);
    }
  }, [connectionStatus, isAvatarReady, startCall, endCall, isLoading, avatarState, vapi]);


  // Status helpers
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return <Wifi className="w-5 h-5 text-green-400" />;
      case ConnectionStatus.CONNECTING:
        return <Wifi className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case ConnectionStatus.ERROR:
        return <WifiOff className="w-5 h-5 text-red-400" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return 'Connected';
      case ConnectionStatus.CONNECTING:
        return 'Connecting...';
      case ConnectionStatus.ERROR:
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen 
        isVisible={isInitialLoading} 
        message="NatalIA - Autosuplente"
      />

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onDismiss={removeNotification}
      />

      {/* Stats Display */}
      <StatsDisplay />

      {/* Debug Panel - TEMPORAL para troubleshooting */}
      <DebugPanel />

      {/* Simli Test Controls - TEMPORAL */}
      <SimliTestControls />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

      {/* Header */}
      <header className="relative z-10 mb-6">
        <h1 className="text-5xl font-bold text-center mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Natal<span className="neon-text text-cyan-300 sophia-glow">IA</span>
          </span>
        </h1>
        <p className="text-lg text-center text-cyan-300/80">Agenda con tu voz. NatalIA está escuchando.</p>
      </header>

      {/* Main content - Centered Avatar */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Avatar container */}
        <div className="relative bg-black/40 rounded-xl border border-cyan-500/20 backdrop-blur-sm avatar-container">
          <SimliAvatar
            onReady={handleAvatarReady}
            onError={handleAvatarError}
            className="w-full aspect-video rounded-xl"
            vapiInstance={vapi}
            isCallActive={connectionStatus === ConnectionStatus.CONNECTED}
            avatarState={avatarState}
          />

          {/* Status indicator overlay */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>

          {/* Avatar message */}
          {/* <div className="absolute bottom-4 left-4 right-4"> */}
            {/* <div className="bg-black/80 px-4 py-3 rounded-full backdrop-blur-sm text-center"> */}
              {/* <span className="text-sm font-medium text-cyan-300"> */}
                {/* ¡Hola! Soy Natalia, tu asistente virtual. Natalia en Reposo para comenzar */}
              {/* </span> */}
            {/* </div> */}
          {/* </div> */}
        </div>

        {/* Control buttons */}
        <div className="flex justify-center">
          <button
            onClick={handleCallToggle}
            disabled={isLoading || connectionStatus === ConnectionStatus.CONNECTING}
            className={cn(
              "px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105",
              "flex items-center space-x-4 shadow-2xl",
              connectionStatus === ConnectionStatus.CONNECTED
                ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                : "text-white btn-primary shadow-[0_0_40px_rgba(6,182,212,0.4)]",
              (isLoading || connectionStatus === ConnectionStatus.CONNECTING) && "opacity-50 cursor-not-allowed"
            )}
          >
            {connectionStatus === ConnectionStatus.CONNECTED ? (
              <>
                <PhoneOff className="w-8 h-8" />
                <span>Terminar</span>
              </>
            ) : connectionStatus === ConnectionStatus.CONNECTING ? (
              <>
                <Phone className="w-8 h-8 animate-pulse" />
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Phone className="w-8 h-8" />
                <span>Agendar</span>
              </>
            )}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400 text-sm font-medium">Error: {error}</p>
          </div>
        )}
      </div>
        {/* Footer de derechos reservados */}
        <div className="text-center mt-8 text-sm neon-text">
          © 2025 <a href="https://suplente.cl/reservas/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-300">suplente.cl</a> – Todos los derechos reservados.
        </div>
      </div>
            

    </>
  );
}
