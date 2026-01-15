import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router';

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { MuscleDistribution } from '@/components/features/muscle-distribuition';
import { CardioAnalysis } from '@/components/features/cardio-analysis';
import { UserHeader } from '@/components/features/user-header';
import { WorkoutHistoryItem } from '@/components/features/workout-history-item';

import {
  Dumbbell,
  TrendingUp,
  CalendarDays,
  Activity,
  Database,
  Plus,
  Coffee,
} from 'lucide-react-native';
import { SIMULATION_OPTIONS, STREAK_TIERS } from '@/lib/constants';
import { DevFloatingMenu } from '@/components/features/dev-floating-menu';

dayjs.locale('pt-br');

export default function Dashboard() {
  const { user, history, resetData, seedData, restDays, toggleRestDay } = useStore();

  const [selectedDate, setSelectedDate] = useState(dayjs());

  useFocusEffect(useCallback(() => {}, [history, restDays]));

  const tierColor = useMemo(() => {
    const tier =
      STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
    return tier.color;
  }, [user.streak]);

  const totalSets = useMemo(() => {
    let sets = 0;
    history.forEach((session) => session.exercises.forEach((ex) => (sets += ex.sets.length)));
    return sets;
  }, [history]);

  const filteredWorkouts = useMemo(() => {
    const targetDate = selectedDate.format('YYYY-MM-DD');
    return history.filter((workout) => workout.date.startsWith(targetDate));
  }, [selectedDate, history]);

  const isRestDay = useMemo(() => {
    const targetDate = selectedDate.format('YYYY-MM-DD');
    return restDays.includes(targetDate);
  }, [selectedDate, restDays]);

  const handleToggleRest = () => toggleRestDay(selectedDate.toISOString());

  const handleReset = () => {
    Alert.alert('Zerar Tudo?', 'Isso apagará todo seu histórico.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Zerar', style: 'destructive', onPress: resetData },
    ]);
  };

  const quickSeed = (days: number) => {
    resetData();
    setTimeout(() => seedData(days), 50);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background p-6 pt-12"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <UserHeader selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <View className="mb-8">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">
              {selectedDate.isSame(dayjs(), 'day')
                ? 'Hoje'
                : selectedDate.format('dddd, DD [de] MMMM')}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/workout/new')}
              className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
              <Plus size={16} className="text-primary" />
              <Text className="text-xs font-bold text-primary">Novo Treino</Text>
            </TouchableOpacity>
          </View>

          {filteredWorkouts.length > 0 ? (
            <View className="gap-3">
              {filteredWorkouts.map((item) => (
                <WorkoutHistoryItem key={item.id} workout={item} />
              ))}
              {isRestDay && (
                <Text className="mt-2 text-center text-xs text-muted-foreground">
                  * Treino realizado anula o descanso.
                </Text>
              )}
            </View>
          ) : (
            <Card
              className={`items-center justify-center gap-3 border-2 border-dashed p-6 ${isRestDay ? 'border-blue-500/30 bg-blue-500/5' : 'border-muted bg-muted/10'}`}>
              {isRestDay ? (
                <>
                  <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                    <Coffee size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-lg font-bold text-blue-500">Dia de Descanso</Text>
                  <Text className="text-center text-xs text-muted-foreground">
                    Ofensiva Congelada.
                  </Text>
                  <Button variant="ghost" className="h-8" onPress={handleToggleRest}>
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
                    onPress={handleToggleRest}>
                    <Coffee size={16} className="text-primary" />
                    <Text className="text-xs font-bold text-primary">Marcar Descanso</Text>
                  </Button>
                </>
              )}
            </Card>
          )}
        </View>

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

        <View className="mb-8 gap-6">
          <MuscleDistribution />
          <CardioAnalysis />
        </View>
      </ScrollView>
      <DevFloatingMenu />
    </View>
  );
}

const StatsCard = ({ icon: Icon, hexColor, label, value }: any) => (
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
