import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Timer, MapPin, Footprints, X, ChevronRight } from 'lucide-react-native';
import dayjs from 'dayjs';
import { STREAK_TIERS } from '@/lib/constants';

type TimeRange = 'week' | 'month' | 'all';

export function CardioAnalysis() {
  const { history, user } = useStore();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const tierColor = useMemo(() => {
    const tier =
      STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
    return tier.color;
  }, [user.streak]);

  const today = dayjs();
  let startDate: dayjs.Dayjs | null = null;

  if (timeRange === 'week') startDate = today.subtract(6, 'day');
  if (timeRange === 'month') startDate = today.subtract(29, 'day');

  let totalKm = 0;
  let totalMinutes = 0;
  let cardioSessions = 0;

  const activityBreakdown: Record<string, { km: number; min: number; count: number }> = {};

  history.forEach((session) => {
    const sessionDate = dayjs(session.date);

    if (startDate && sessionDate.isBefore(startDate, 'day')) return;

    session.exercises.forEach((ex) => {
      if (ex.group === 'Cardio') {
        ex.sets.forEach((set) => {
          const dist = set.distance || 0;
          const dur = set.duration || 0;

          totalKm += dist;
          totalMinutes += dur;
          if (dur > 0 || dist > 0) cardioSessions++;

          if (!activityBreakdown[ex.name]) {
            activityBreakdown[ex.name] = { km: 0, min: 0, count: 0 };
          }
          activityBreakdown[ex.name].km += dist;
          activityBreakdown[ex.name].min += dur;
          activityBreakdown[ex.name].count += 1;
        });
      }
    });
  });

  if (timeRange === 'all' && cardioSessions === 0) return null;

  const displayKm = selectedActivity ? activityBreakdown[selectedActivity]?.km || 0 : totalKm;
  const displayMinutes = selectedActivity
    ? activityBreakdown[selectedActivity]?.min || 0
    : totalMinutes;

  const cardTitle = selectedActivity ? selectedActivity : 'Análise Cardio';

  const FilterButton = ({ label, value }: { label: string; value: TimeRange }) => (
    <TouchableOpacity
      onPress={() => setTimeRange(value)}
      className={`rounded-md border px-2 py-1 ${
        timeRange === value ? 'border-primary bg-primary' : 'border-transparent bg-transparent'
      }`}>
      <Text
        className={`text-[10px] font-bold ${
          timeRange === value ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <Card className="mt-6 w-full border-border/50 bg-card/80">
      <CardHeader className="pb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Footprints size={18} color={tierColor} />
            <Text className="text-base font-bold text-foreground">{cardTitle}</Text>
          </View>

          {selectedActivity && (
            <TouchableOpacity onPress={() => setSelectedActivity(null)}>
              <X size={20} className="text-muted-foreground" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <CardDescription>
            {timeRange === 'week'
              ? 'Últimos 7 dias'
              : timeRange === 'month'
                ? 'Últimos 30 dias'
                : 'Todo o período'}
          </CardDescription>

          <View className="flex-row rounded-lg bg-muted/50 p-0.5">
            <FilterButton label="7D" value="week" />
            <FilterButton label="30D" value="month" />
            <FilterButton label="Total" value="all" />
          </View>
        </View>
      </CardHeader>

      <CardContent>
        <View className="mb-4 flex-row gap-3">
          <View
            className="flex-1 items-center rounded-xl border p-3"
            style={
              selectedActivity
                ? {
                    borderColor: `${tierColor}40`,
                    backgroundColor: `${tierColor}20`,
                  }
                : {
                    borderColor: `${tierColor}20`,
                    backgroundColor: `${tierColor}10`,
                  }
            }>
            <MapPin size={20} className="mb-1" color={tierColor} />
            <Text className="text-xl font-bold text-foreground">{displayKm.toFixed(1)}</Text>
            <Text className="text-[10px] font-bold uppercase text-muted-foreground">Km Total</Text>
          </View>

          <View
            className="flex-1 items-center rounded-xl border p-3"
            style={
              selectedActivity
                ? {
                    borderColor: `${tierColor}40`,
                    backgroundColor: `${tierColor}20`,
                  }
                : {
                    borderColor: `${tierColor}20`,
                    backgroundColor: `${tierColor}10`,
                  }
            }>
            <Timer size={20} className="mb-1" color={tierColor} />
            <Text className="text-xl font-bold text-foreground">
              {Math.floor(displayMinutes / 60)}h {displayMinutes % 60}m
            </Text>
            <Text className="text-[10px] font-bold uppercase text-muted-foreground">Duração</Text>
          </View>
        </View>

        <View className="gap-2">
          {Object.keys(activityBreakdown).length > 0 ? (
            <View className="overflow-hidden rounded-xl border border-border bg-muted/30">
              {Object.entries(activityBreakdown)
                .sort(([, a], [, b]) => b.min - a.min)
                .map(([name, stats], idx) => {
                  const isSelected = selectedActivity === name;

                  return (
                    <TouchableOpacity
                      key={name}
                      onPress={() => setSelectedActivity(isSelected ? null : name)}
                      className={`flex-row items-center justify-between p-3 ${
                        idx !== 0 ? 'border-t border-border/50' : ''
                      }`}
                      style={isSelected ? { backgroundColor: `${tierColor}15` } : {}}>
                      <View className="flex-row items-center gap-2">
                        <Text
                          className={`text-sm ${
                            isSelected ? 'font-bold' : 'font-medium text-foreground'
                          }`}
                          style={isSelected ? { color: tierColor } : {}}>
                          {name}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <View className="items-end">
                          <Text
                            className={`text-xs font-bold ${isSelected ? '' : 'text-foreground'}`}
                            style={isSelected ? { color: tierColor } : {}}>
                            {stats.km > 0 ? `${stats.km.toFixed(1)} km` : ''}
                            {stats.km > 0 && stats.min > 0 ? ' • ' : ''}
                            {stats.min > 0 ? `${stats.min} min` : ''}
                          </Text>
                          <Text className="text-[10px] text-muted-foreground">
                            {stats.count} sessões
                          </Text>
                        </View>
                        {isSelected && <ChevronRight size={14} color={tierColor} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ) : (
            <View className="items-center py-4">
              <Text className="text-xs text-muted-foreground">
                Nenhuma atividade cardio neste período.
              </Text>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
