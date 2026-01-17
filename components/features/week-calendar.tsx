import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import dayjs from 'dayjs';
import { useStore } from '@/store/useStore';
import { Coffee, Dumbbell, Footprints } from 'lucide-react-native';

interface WeekCalendarProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  tierColor: string;
  restDays?: string[];
}

export function WeekCalendar({
  selectedDate,
  onSelectDate,
  tierColor,
  restDays,
}: WeekCalendarProps) {
  const { history } = useStore();

  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf('week');
    return Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
  }, [selectedDate]);

  const workoutDetailsMap = useMemo(() => {
    const map = new Map<string, { hasWeights: boolean; hasCardio: boolean }>();

    history.forEach((h) => {
      const dateKey = dayjs(h.date).format('YYYY-MM-DD');
      const current = map.get(dateKey) || { hasWeights: false, hasCardio: false };

      h.exercises.forEach((ex) => {
        if (ex.group === 'Cardio') {
          current.hasCardio = true;
        } else {
          current.hasWeights = true;
        }
      });

      map.set(dateKey, current);
    });

    return map;
  }, [history]);

  const restMap = useMemo(() => new Set(restDays), [restDays]);

  return (
    <View className="flex-row justify-between pt-2">
      {weekDays.map((date) => {
        const isSelected = date.isSame(selectedDate, 'day');
        const isToday = date.isSame(dayjs(), 'day');
        const dateStr = date.format('YYYY-MM-DD');

        const details = workoutDetailsMap.get(dateStr);
        const hasWorkout = !!details;
        const isRest = restMap.has(dateStr);

        const showWeights = details?.hasWeights;
        const showCardio = details?.hasCardio;
        const showRest = isRest && !hasWorkout;

        return (
          <TouchableOpacity
            key={dateStr}
            onPress={() => onSelectDate(date)}
            className={`h-[72px] w-[13%] items-center justify-between rounded-lg px-1 py-2 ${
              isSelected ? 'bg-muted/50' : 'bg-transparent'
            }`}>
            <Text
              className={`text-[10px] uppercase ${
                isSelected ? 'font-bold text-foreground' : 'text-muted-foreground'
              }`}>
              {date.format('ddd').replace('.', '')}
            </Text>

            <View
              className="h-8 w-8 items-center justify-center rounded-full border"
              style={{
                borderColor: isToday ? tierColor : 'transparent',
                backgroundColor: isToday
                  ? `${tierColor}20`
                  : isSelected
                    ? 'transparent'
                    : 'rgba(113, 113, 122, 0.1)',
              }}>
              <Text
                className={`text-sm ${
                  isToday || isSelected ? 'font-bold text-foreground' : 'text-foreground'
                }`}>
                {date.format('DD')}
              </Text>
            </View>

            <View className="h-3 flex-row items-center justify-center gap-0.5">
              {showRest ? (
                <Coffee size={12} color={tierColor} />
              ) : hasWorkout ? (
                <>
                  {showWeights && <Dumbbell size={12} color={tierColor} />}
                  {showCardio && <Footprints size={12} color={tierColor} />}
                </>
              ) : (
                <View className="h-3 w-3" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
