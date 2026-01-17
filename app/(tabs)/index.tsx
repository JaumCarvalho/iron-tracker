import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';

import { UserHeader } from '@/components/features/user-header';
import { MuscleDistribution } from '@/components/features/muscle-distribuition';
import { CardioAnalysis } from '@/components/features/cardio-analysis';

import { DevFloatingMenu } from '@/components/features/dev-floating-menu';
import { useDashboard } from '@/components/dashboard/useDashboard';
import {
  DateHeader,
  DailySummary,
  StatsOverview,
} from '@/components/dashboard/dashboard-components';

const ChartsSection = memo(() => {
  return (
    <View className="mb-8 gap-6">
      <MuscleDistribution />
      <CardioAnalysis />
    </View>
  );
});

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
    effectiveRestDays,
    actions,
  } = useDashboard();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background p-6 pt-12"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <UserHeader
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          restDays={effectiveRestDays}
        />

        <View className="mb-8">
          <DateHeader
            selectedDate={selectedDate}
            isToday={isToday}
            onNewWorkout={actions.handleNewWorkout}
            accentColor={user.accentColor}
          />

          <DailySummary
            workouts={filteredWorkouts}
            isRestDay={isRestDay}
            onToggleRest={actions.handleToggleRest}
            accentColor={user.accentColor}
          />
        </View>

        <StatsOverview
          accentColor={user.accentColor}
          user={user}
          history={history}
          totalSets={totalSets}
          tierColor={tierColor}
        />

        <ChartsSection />
      </ScrollView>

      <DevFloatingMenu />
    </View>
  );
}
