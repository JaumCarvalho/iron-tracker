import React from 'react';
import { ScrollView, View } from 'react-native';
import dayjs from 'dayjs';

import { UserHeader } from '@/components/features/user-header';
import { MuscleDistribution } from '@/components/features/muscle-distribuition';
import { CardioAnalysis } from '@/components/features/cardio-analysis';
import { DevFloatingMenu } from '@/components/features/dev-floating-menu';

import {
  DateHeader,
  DailySummary,
  StatsOverview,
  StatsCard,
} from '@/components/dashboard/dashboard-components';
import { TrendingUp, CalendarDays } from 'lucide-react-native';
import { useDashboard } from '@/components/dashboard/useDashboard';

export default function Dashboard() {
  const {
    user,
    history,
    selectedDate,
    setSelectedDate,
    tierColor,
    totalSets,
    filteredWorkouts,
    isRestDay,
    isToday,
    actions,
  } = useDashboard();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background p-6 pt-12"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <UserHeader selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <View className="mb-8">
          <DateHeader
            selectedDate={selectedDate}
            isToday={isToday}
            onNewWorkout={actions.handleNewWorkout}
          />

          <DailySummary
            workouts={filteredWorkouts}
            isRestDay={isRestDay}
            onToggleRest={actions.handleToggleRest}
          />
        </View>

        <StatsOverview user={user} history={history} totalSets={totalSets} tierColor={tierColor} />

        <View className="-mt-3 mb-6 flex-row flex-wrap gap-3">
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
