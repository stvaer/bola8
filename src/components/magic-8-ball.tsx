'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const affirmations = [
  'Sí, definitivamente',
  'Es cierto',
  'Es decididamente así',
  'Sin lugar a dudas',
  'Puedes confiar en ello',
  'Como yo lo veo, sí',
  'Lo más probable',
  'Perspectiva buena',
  'Sí',
  'Las señales apuntan a que sí',
  'No cuentes con ello',
  'Mi respuesta es no',
  'Mis fuentes dicen que no',
  'Las perspectivas no son muy buenas',
  'Muy dudoso',
  'Respuesta confusa, vuelve a intentarlo',
  'Vuelve a preguntar más tarde',
  'Mejor no decirte ahora',
  'No se puede predecir ahora',
  'Concéntrate y vuelve a preguntar',
];

export function Magic8Ball() {
  const [affirmation, setAffirmation] = useState('8');
  const [status, setStatus] = useState<'idle' | 'shaking' | 'loading'>('idle');
  const isBusy = status === 'shaking' || status === 'loading';

  const getAffirmation = useCallback(() => {
    if (isBusy) return;

    setStatus('shaking');

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      // Vibrate for 1 second to match the shake animation
      navigator.vibrate(1000);
    }

    setTimeout(() => {
      setStatus('loading');
      
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const newAffirmation = affirmations[randomIndex];
      
      setTimeout(() => {
        setAffirmation(newAffirmation);
        setStatus('idle');
      }, 500);

    }, 1000);
  }, [isBusy]);

  /*
  // Shake functionality commented out as per request
  import { useEffect, useRef } from 'react';
  import { useToast } from "@/hooks/use-toast"

  const [permissionState, setPermissionState] = useState<'unknown' | 'required' | 'granted'>('unknown');
  const { toast } = useToast();
  const lastShakeTimestamp = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      setPermissionState('required');
    } else {
      setPermissionState('granted');
    }
  }, []);

  useEffect(() => {
    if (permissionState !== 'granted') return;

    const SHAKE_THRESHOLD = 120;
    const SHAKE_COOLDOWN = 3000;
    let lastUpdate = 0;
    let last_x: number | null = null, last_y: number | null = null, last_z: number | null = null;

    const handler = (event: DeviceMotionEvent) => {
      if (status === 'shaking' || status === 'loading') return;
      
      const curTime = Date.now();
      
      if (curTime - lastShakeTimestamp.current < SHAKE_COOLDOWN) {
        return;
      }

      const { acceleration } = event;
      if (!acceleration) return;
      
      if ((curTime - lastUpdate) > 100) {
        const diffTime = (curTime - lastUpdate);
        lastUpdate = curTime;
        const { x, y, z } = acceleration;

        if (x === null || y === null || z === null) return;
        
        if (last_x !== null && last_y !== null && last_z !== null) {
           const speed = (Math.abs(x - last_x) + Math.abs(y - last_y) + Math.abs(z - last_z)) / diffTime * 10000;
           if (speed > SHAKE_THRESHOLD) {
              lastShakeTimestamp.current = curTime;
              getAffirmation();
           }
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
    };
    
    window.addEventListener('devicemotion', handler, true);
    return () => window.removeEventListener('devicemotion', handler, true);
  }, [permissionState, getAffirmation, status]);

  const requestMotionPermission = useCallback(async () => {
    if (permissionState !== 'required') return;

    try {
      const result = await (DeviceMotionEvent as any).requestPermission();
      if (result === 'granted') {
        setPermissionState('granted');
      } else {
        toast({
            title: "Permiso denegado",
            description: "No se puede usar la agitación sin tu permiso.",
            variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Permission not granted', error);
      toast({
            title: "Error de Permiso",
            description: "Hubo un problema al solicitar el permiso de movimiento.",
            variant: "destructive",
      })
    }
  }, [permissionState, toast]);
  */
  
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-10 w-10 animate-spin text-digital-green text-glow" />;
      case 'idle':
      case 'shaking':
        return (
          <p className="font-digital text-[15px] text-digital-green text-glow text-center leading-tight px-4 animate-fade-in">
            {affirmation}
          </p>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div
        className={cn(
          'relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-primary flex items-center justify-center overflow-hidden',
          'transition-transform duration-500 ease-in-out shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_10px_20px_rgba(255,255,255,0.1),inset_0_-10px_20px_rgba(0,0,0,0.4)]',
          status === 'shaking' && 'animate-shake'
        )}
      >
        <div className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full bg-black/70 flex items-center justify-center shadow-inner">
           <div className="absolute w-full h-full rounded-full border-2 border-blue-900/50" />
            <div className={cn(
                'transition-opacity duration-500 flex items-center justify-center',
                !isBusy ? 'opacity-100' : 'opacity-50'
            )}>
             {renderContent()}
          </div>
        </div>
      </div>
      
      {/*
      {permissionState === 'required' && (
        <Button onClick={requestMotionPermission} variant="outline" className="bg-background/80 hover:bg-background">
          Habilitar agitación del dispositivo
        </Button>
      )}
      */}

      <Button onClick={getAffirmation} disabled={isBusy} size="lg" className="min-w-[280px]">
        {isBusy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Consultando los espíritus...
          </>
        ) : 'Agitar la Bola Mágica'}
      </Button>
    </div>
  );
}
