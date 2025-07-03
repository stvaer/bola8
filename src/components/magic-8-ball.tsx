'use client';

import { useState, useEffect, useCallback } from 'react';
import { selectAffirmation } from '@/ai/flows/affirmation-selection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export function Magic8Ball() {
  const [affirmation, setAffirmation] = useState('8');
  const [status, setStatus] = useState<'idle' | 'shaking' | 'loading' | 'error'>('idle');
  const [isPermissionRequired, setIsPermissionRequired] = useState(false);
  const { toast } = useToast();

  const getAffirmation = useCallback(async () => {
    if (status === 'shaking' || status === 'loading') return;

    setStatus('shaking');

    const shakeTimeout = setTimeout(async () => {
      setStatus('loading');
      try {
        const result = await selectAffirmation();
        setAffirmation(result.affirmation);
        setStatus('idle');
      } catch (e) {
        console.error(e);
        setAffirmation('Error');
        setStatus('error');
        toast({
          title: "Error de Conexión",
          description: "No se pudo consultar a los espíritus. Revisa tu conexión.",
          variant: "destructive",
        })
      }
    }, 1000);

    return () => clearTimeout(shakeTimeout);
  }, [status, toast]);

  const addShakeListener = useCallback(() => {
    const SHAKE_THRESHOLD = 30;
    let lastUpdate = 0;
    let last_x: number | null, last_y: number | null, last_z: number | null;

    const handler = (event: DeviceMotionEvent) => {
      if (status === 'shaking' || status === 'loading') return;
      const { acceleration } = event;
      if (!acceleration) return;
      
      const curTime = new Date().getTime();
      if ((curTime - lastUpdate) > 100) {
        const diffTime = (curTime - lastUpdate);
        lastUpdate = curTime;
        const { x, y, z } = acceleration;

        if (last_x !== null && last_y !== null && last_z !== null && x !== null && y !== null && z !== null) {
           const speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
           if (speed > SHAKE_THRESHOLD) {
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
  }, [getAffirmation, status]);

  const requestMotionPermission = useCallback(async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      addShakeListener();
      return;
    }

    try {
      const permissionState = await (DeviceMotionEvent as any).requestPermission();
      if (permissionState === 'granted') {
        setIsPermissionRequired(false);
        addShakeListener();
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
  }, [addShakeListener, toast]);
  
  useEffect(() => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      setIsPermissionRequired(true);
    } else {
      addShakeListener();
    }
  }, [addShakeListener]);
  
  const isBusy = status === 'shaking' || status === 'loading';

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-10 w-10 animate-spin text-digital-green text-glow" />;
      case 'error':
        return (
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 text-digital-green text-glow mb-2" />
            <p className="font-digital text-[25px] text-digital-green text-glow text-center leading-tight px-4 animate-fade-in">{affirmation}</p>
          </div>
        );
      case 'idle':
      case 'shaking':
        return (
          <p className="font-digital text-[25px] text-digital-green text-glow text-center leading-tight px-4 animate-fade-in">
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
      
      {isPermissionRequired && (
        <Button onClick={requestMotionPermission} variant="outline" className="bg-background/80 hover:bg-background">
          Habilitar agitación del dispositivo
        </Button>
      )}

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
