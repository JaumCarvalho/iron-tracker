import React, { useState, useMemo, memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Activity, Footprints, Timer, TrendingUp } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import dayjs from 'dayjs';

type TimeRange = 'week' | 'month' | 'all';

const FilterGroup = memo(
  ({
    current,
    onChange,
    accentColor,
  }: {
    current: TimeRange;
    onChange: (v: TimeRange) => void;
    accentColor: string;
  }) => (
    <View className="flex-row rounded-lg bg-muted/50 p-0.5">
      {(['week', 'month', 'all'] as TimeRange[]).map((value) => {
        const isActive = current === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(value)}
            className={`rounded-md border px-2 py-1 ${
              !isActive ? 'border-transparent bg-transparent' : ''
            }`}
            style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}>
            <Text
              className={`text-[10px] font-bold ${
                isActive ? 'text-white' : 'text-muted-foreground'
              }`}>
              {value === 'week' ? '7D' : value === 'month' ? '30D' : 'Total'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
);

const EmptyState = memo(() => (
  <View className="h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/10">
    <Footprints size={24} className="mb-2 text-muted-foreground opacity-50" />
    <Text className="text-xs text-muted-foreground">Nenhum cardio registrado neste período.</Text>
  </View>
));

const CardioItem = memo(({ name, dist, time, count, color, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`mb-2 flex-row items-center justify-between rounded-lg border p-2 last:mb-0 ${
      isSelected ? 'bg-muted/40' : 'border-border/50 bg-muted/10'
    }`}
    style={isSelected ? { borderColor: color, borderWidth: 1 } : {}}>
    <View className="flex-1">
      <Text className={`font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
        {name}
      </Text>
      <Text className="text-[10px] text-muted-foreground">{count} sessões</Text>
    </View>
    <View className="items-end">
      <View className="flex-row items-center gap-1">
        <Text className="text-sm font-bold" style={{ color: color }}>
          {dist.toFixed(1)}km
        </Text>
      </View>
      <Text className="text-[10px] text-muted-foreground">{time.toFixed(0)}min</Text>
    </View>
  </TouchableOpacity>
));

function useCardioStats(history: any[], timeRange: TimeRange) {
  const startDate = useMemo(() => {
    const today = dayjs();
    if (timeRange === 'week') return today.subtract(6, 'day');
    if (timeRange === 'month') return today.subtract(29, 'day');
    return null;
  }, [timeRange]);

  return useMemo(() => {
    let totalDist = 0;
    let totalTime = 0;
    let sessions = 0;
    const breakdown: Record<string, { dist: number; time: number; count: number }> = {};

    history.forEach((workout) => {
      if (startDate) {
        if (dayjs(workout.date).isBefore(startDate, 'day')) return;
      }

      workout.exercises.forEach((ex: any) => {
        if (ex.group !== 'Cardio') return;

        const exDist = ex.sets.reduce(
          (acc: number, s: any) => acc + (parseFloat(s.distance) || 0),
          0
        );
        const exTime = ex.sets.reduce(
          (acc: number, s: any) =>
            acc + (parseFloat(s.duration) || parseFloat(s.manualDuration) || 0),
          0
        );

        if (exDist > 0 || exTime > 0) {
          sessions++;
          totalDist += exDist;
          totalTime += exTime;

          if (!breakdown[ex.name]) breakdown[ex.name] = { dist: 0, time: 0, count: 0 };
          breakdown[ex.name].dist += exDist;
          breakdown[ex.name].time += exTime;
          breakdown[ex.name].count += 1;
        }
      });
    });

    const sortedActivities = Object.entries(breakdown)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.dist - a.dist);

    return { totalDist, totalTime, sessions, activities: sortedActivities };
  }, [history, startDate]);
}

export function CardioAnalysis() {
  const history = useStore((state) => state.history);
  const accentColor = useStore((state) => state.user.accentColor) || '#a1a1aa';

  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const { totalDist, totalTime, sessions, activities } = useCardioStats(history, timeRange);

  const displayStats = useMemo(() => {
    if (selectedActivity) {
      const specific = activities.find((a) => a.name === selectedActivity);
      if (specific) {
        return {
          dist: specific.dist,
          time: specific.time,
          count: specific.count,
          label: selectedActivity,
        };
      }
    }
    return {
      dist: totalDist,
      time: totalTime,
      count: sessions,
      label: 'Geral',
    };
  }, [selectedActivity, activities, totalDist, totalTime, sessions]);

  const handleSelect = (name: string) => {
    if (selectedActivity === name) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(name);
    }
  };

  return (
    <Card className="w-full border-border/50 bg-card/80">
      <CardHeader className="pb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Activity size={18} color={accentColor} />
            <Text className="text-base font-bold text-foreground">
              Cardio{' '}
              <Text className="text-xs font-normal text-muted-foreground">
                ({displayStats.label})
              </Text>
            </Text>
          </View>

          <FilterGroup current={timeRange} onChange={setTimeRange} accentColor={accentColor} />
        </View>
      </CardHeader>

      <CardContent>
        {totalDist === 0 && totalTime === 0 ? (
          <EmptyState />
        ) : (
          <View>
            <View className="mb-4 flex-row gap-2">
              <View
                className="flex-1 items-center rounded-lg border p-2"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}20`,
                }}>
                <Footprints size={16} className="mb-1" color={accentColor} />
                <Text className="text-lg font-bold text-foreground">
                  {displayStats.dist.toFixed(1)}
                  <Text className="text-xs font-normal text-muted-foreground">km</Text>
                </Text>
              </View>

              <View
                className="flex-1 items-center rounded-lg border p-2"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}20`,
                }}>
                <Timer size={16} className="mb-1" color={accentColor} />
                <Text className="text-lg font-bold text-foreground">
                  {displayStats.time.toFixed(0)}
                  <Text className="text-xs font-normal text-muted-foreground">min</Text>
                </Text>
              </View>

              <View
                className="flex-1 items-center rounded-lg border p-2"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}20`,
                }}>
                <TrendingUp size={16} className="mb-1" color={accentColor} />
                <Text className="text-lg font-bold text-foreground">
                  {displayStats.count}
                  <Text className="text-xs font-normal text-muted-foreground">x</Text>
                </Text>
              </View>
            </View>

            <Text className="mb-2 text-xs font-bold uppercase text-muted-foreground">
              Atividades
            </Text>
            {activities.map((activity) => (
              <CardioItem
                key={activity.name}
                {...activity}
                color={accentColor}
                isSelected={selectedActivity === activity.name}
                onPress={() => handleSelect(activity.name)}
              />
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
