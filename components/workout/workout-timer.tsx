import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Timer } from 'lucide-react-native';

interface WorkoutTimerProps {
  startTime: string | null;
  status: 'idle' | 'training' | 'resting';
}

export function WorkoutTimer({ startTime, status }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any;

    if (startTime) {
      const start = new Date(startTime).getTime();

      interval = setInterval(() => {
        const now = new Date().getTime();
        setElapsed(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const m = mins.toString().padStart(2, '0');
    const s = secs.toString().padStart(2, '0');
    return hrs > 0 ? `${hrs}:${m}:${s}` : `${m}:${s}`;
  };

  return (
    <View className="items-center">
      <View className="mb-1 flex-row items-center gap-1">
        <Text className="text-[10px] font-bold uppercase text-muted-foreground">
          {status === 'idle' ? 'Pronto' : status === 'training' ? 'Treinando' : 'Descanso'}
        </Text>
      </View>

      <View
        className={`flex-row items-center gap-2 rounded-full border px-4 py-1 ${
          status === 'training'
            ? 'border-primary/20 bg-primary/10'
            : status === 'resting'
              ? 'border-blue-500/20 bg-blue-500/10'
              : 'border-transparent bg-muted'
        }`}>
        <Timer
          size={14}
          className={
            status === 'training'
              ? 'text-primary'
              : status === 'resting'
                ? 'text-blue-500'
                : 'text-muted-foreground'
          }
        />
        <Text
          className={`font-mono text-xl font-bold ${
            status === 'training'
              ? 'text-primary'
              : status === 'resting'
                ? 'text-blue-500'
                : 'text-muted-foreground'
          }`}>
          {formatTime(elapsed)}
        </Text>
      </View>
    </View>
  );
}
