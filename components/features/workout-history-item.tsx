import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  Dumbbell,
  Clock,
  ChevronDown,
  ChevronUp,
  Trophy,
  Footprints,
  ChevronRight,
} from 'lucide-react-native';
import dayjs from 'dayjs';
import { router } from 'expo-router';
const formatDuration = (seconds: number) => {
  if (!seconds) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

interface WorkoutHistoryItemProps {
  workout: any;
}

export function WorkoutHistoryItem({ workout }: WorkoutHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCardioFocus =
    workout.exercises && workout.exercises.some((ex: any) => ex.group === 'Cardio');
  const dateObj = dayjs(workout.date);

  return (
    <Card className="mb-3 overflow-hidden border border-border bg-card shadow-sm">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
        className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className={`h-12 w-12 items-center justify-center rounded-xl border bg-muted/50 ${isCardioFocus ? 'border-pink-500/20' : 'border-primary/20'}`}>
              <Text className="text-xs font-bold uppercase text-muted-foreground">
                {dateObj.format('MMM')}
              </Text>
              <Text className="text-lg font-bold text-foreground">{dateObj.format('DD')}</Text>
            </View>

            <View>
              <Text className="text-base font-bold capitalize text-foreground">
                {dateObj.format('dddd')}
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Clock size={12} color="#888" />
                  <Text className="text-xs text-muted-foreground">
                    {formatDuration(workout.durationSeconds)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Trophy size={12} color="#eab308" />
                  <Text className="text-xs text-muted-foreground">{workout.xpEarned} XP</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="items-end gap-1">
            {isCardioFocus ? (
              <Footprints size={20} color="#ec4899" />
            ) : (
              <Dumbbell size={20} color="#0ea5e9" />
            )}
            {isExpanded ? (
              <ChevronUp size={16} color="#888" />
            ) : (
              <ChevronDown size={16} color="#888" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="border-t border-border bg-muted/20 px-4 py-3">
          {workout.exercises.map((ex: any, idx: number) => {
            const isCardio = ex.group === 'Cardio';

            let detailsText = '';
            if (isCardio) {
              const set = ex.sets[0];
              detailsText = `${set.duration || 0} min • ${set.distance || 0} km`;
            } else {
              const setsCount = ex.sets.length;
              const maxWeight =
                ex.sets.length > 0 ? Math.max(...ex.sets.map((s: any) => s.weight || 0)) : 0;
              detailsText = `${setsCount} séries • Max ${maxWeight}kg`;
            }

            return (
              <View
                key={idx}
                className="flex-row items-center justify-between border-b border-border/40 py-2 last:border-0">
                <View className="flex-1 flex-row items-center gap-2">
                  <View
                    className={`h-8 w-1 rounded-full ${isCardio ? 'bg-pink-500' : 'bg-primary'}`}
                  />

                  <TouchableOpacity
                    className="flex-1 flex-row items-center"
                    onPress={() =>
                      router.push({
                        pathname: '/analytics/exercise-details',
                        params: {
                          name: ex.name,
                          anchorDate: workout.date,
                        },
                      })
                    }>
                    <View>
                      <Text className="text-sm font-bold text-foreground underline decoration-muted-foreground/50 decoration-dotted">
                        {ex.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground">{ex.group}</Text>
                    </View>
                    <ChevronRight size={12} className="ml-1 text-muted-foreground/50" />
                  </TouchableOpacity>
                </View>

                <Text className="rounded border border-border bg-background px-2 py-1 text-xs font-bold text-foreground">
                  {detailsText}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}
