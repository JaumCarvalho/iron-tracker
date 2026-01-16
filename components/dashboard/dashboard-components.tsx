import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Coffee, Dumbbell, Activity, CalendarDays, TrendingUp } from 'lucide-react-native';
import dayjs from 'dayjs';
import { WorkoutHistoryItem } from '@/components/features/workout-history-item';

export const DateHeader = memo(({ selectedDate, isToday, onNewWorkout }: any) => (
  <View className="mb-3 flex-row items-center justify-between">
    <Text className="text-lg font-bold text-foreground">
      {isToday ? 'Hoje' : selectedDate.format('dddd, DD [de] MMMM')}
    </Text>

    <TouchableOpacity
      onPress={onNewWorkout}
      className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
      <Plus size={16} className="text-primary" />
      <Text className="text-xs font-bold text-primary">Novo Treino</Text>
    </TouchableOpacity>
  </View>
));

export const DailySummary = memo(({ workouts, isRestDay, onToggleRest }: any) => {
  if (workouts.length > 0) {
    return (
      <View className="gap-3">
        {workouts.map((item: any) => (
          <WorkoutHistoryItem key={item.id} workout={item} />
        ))}
        {isRestDay && (
          <Text className="mt-2 text-center text-xs text-muted-foreground">
            * Treino realizado anula o descanso.
          </Text>
        )}
      </View>
    );
  }

  return (
    <Card
      className={`items-center justify-center gap-3 border-2 border-dashed p-6 ${isRestDay ? 'border-blue-500/30 bg-blue-500/5' : 'border-muted bg-muted/10'}`}>
      {isRestDay ? (
        <>
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
            <Coffee size={24} color="#3b82f6" />
          </View>
          <Text className="text-lg font-bold text-blue-500">Dia de Descanso</Text>
          <Text className="text-center text-xs text-muted-foreground">Ofensiva Congelada.</Text>
          <Button variant="ghost" className="h-8" onPress={onToggleRest}>
            <Text className="text-xs text-muted-foreground">Cancelar</Text>
          </Button>
        </>
      ) : (
        <>
          <Text className="text-center text-sm font-medium text-foreground">
            Nenhum treino hoje.
          </Text>
          <Button
            variant="outline"
            className="h-10 w-full flex-row gap-2 border-primary/20 bg-background"
            onPress={onToggleRest}>
            <Coffee size={16} className="text-primary" />
            <Text className="text-xs font-bold text-primary">Marcar Descanso</Text>
          </Button>
        </>
      )}
    </Card>
  );
});

export const StatsOverview = memo(({ user, history, totalSets, tierColor }: any) => {
  return (
    <>
      <Text className="mb-4 text-lg font-bold text-foreground">Visão Geral</Text>
      <View className="mb-6 flex-row flex-wrap gap-3">
        <StatsCard
          icon={Dumbbell}
          hexColor={tierColor}
          label="Treinos"
          value={history.length.toString()}
        />
        <StatsCard
          icon={Activity}
          hexColor={tierColor}
          label="Volume Total"
          value={totalSets.toString() + ' séries'}
        />
        <StatsCard
          icon={CalendarDays}
          hexColor={tierColor}
          label="Último Treino"
          value={history.length > 0 ? dayjs(history[0].date).format('DD/MM') : '--/--'}
        />
        <StatsCard
          icon={TrendingUp}
          hexColor={tierColor}
          label="XP Total"
          value={user.totalXp.toString()}
        />
      </View>
    </>
  );
});
export const StatsCard = ({ icon: Icon, hexColor, label, value }: any) => (
  <View
    className="min-w-[45%] flex-1 rounded-xl border p-4"
    style={{ backgroundColor: `${hexColor}10`, borderColor: `${hexColor}30` }}>
    <View className="mb-2 self-start rounded-full p-2" style={{ backgroundColor: `${hexColor}20` }}>
      <Icon size={20} color={hexColor} />
    </View>
    <View>
      <Text className="text-xs font-medium text-muted-foreground opacity-80">{label}</Text>
      <Text className="text-lg font-bold text-foreground">{value}</Text>
    </View>
  </View>
);
