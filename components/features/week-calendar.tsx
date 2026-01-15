import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import dayjs from 'dayjs';
import { useStore } from '@/store/useStore';
import { Coffee } from 'lucide-react-native';

interface WeekCalendarProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  tierColor: string;
}

export function WeekCalendar({ selectedDate, onSelectDate, tierColor }: WeekCalendarProps) {
  const { history, restDays } = useStore();

  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf('week');
    return Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
  }, [selectedDate]);

  const workoutMap = useMemo(
    () => new Set(history.map((h) => dayjs(h.date).format('YYYY-MM-DD'))),
    [history]
  );

  const restMap = useMemo(() => new Set(restDays), [restDays]);

  return (
    <View className="flex-row justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
      {weekDays.map((date) => {
        const isSelected = date.isSame(selectedDate, 'day');
        const isToday = date.isSame(dayjs(), 'day');
        const dateStr = date.format('YYYY-MM-DD');

        const hasWorkout = workoutMap.has(dateStr);
        const isRest = restMap.has(dateStr);

        let indicatorStyle = { backgroundColor: 'transparent' };

        if (hasWorkout) {
          indicatorStyle = { backgroundColor: tierColor };
        } else if (isRest) {
          indicatorStyle = { backgroundColor: '#3b82f6' };
        }

        return (
          <TouchableOpacity
            key={dateStr}
            onPress={() => onSelectDate(date)}
            className={`items-center gap-2 rounded-lg px-1 py-2 ${
              isSelected ? 'bg-muted' : 'bg-transparent'
            }`}>
            <Text
              className={`text-xs capitalize ${isSelected ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
              {date.format('ddd')}
            </Text>

            <View
              className={`h-8 w-8 items-center justify-center rounded-full border ${
                isToday ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30'
              }`}>
              {isRest && !hasWorkout ? (
                <Coffee size={14} color="#3b82f6" />
              ) : (
                <Text
                  className={`text-sm ${
                    isToday || isSelected ? 'font-bold text-foreground' : 'text-foreground'
                  }`}>
                  {date.format('DD')}
                </Text>
              )}
            </View>

            <View className="h-1.5 w-1.5 rounded-full" style={indicatorStyle} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
