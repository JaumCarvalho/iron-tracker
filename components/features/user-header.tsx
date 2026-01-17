import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import dayjs from 'dayjs';
import { ThemeToggle } from '@/components/features/theme-toggle';
import { router } from 'expo-router';
import { STREAK_TIERS } from '@/lib/constants';
import { WeekCalendar } from '@/components/features/week-calendar';
import { Flame, Snowflake } from 'lucide-react-native';

interface UserHeaderProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  restDays?: string[];
}

export function UserHeader({ selectedDate, onSelectDate, restDays }: UserHeaderProps) {
  const { user } = useStore();

  const userThemeColor = user.accentColor || '#a1a1aa';

  const currentTier = useMemo(() => {
    return STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
  }, [user.streak]);

  const nextTier = useMemo(() => {
    return STREAK_TIERS.slice()
      .reverse()
      .find((t) => t.days > user.streak);
  }, [user.streak]);

  const xpCurrentLevel = user.totalXp % 1000;
  const progressPercentage = (xpCurrentLevel / 1000) * 100;

  const streakStyles = useMemo(() => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    const isFrozen = restDays?.includes(todayStr);
    const s = user.streak;

    if (isFrozen) {
      return {
        primary: '#3b82f6',
        bg: '#3b82f610',
        border: '#3b82f6',
        icon: Snowflake,
        label: 'Congelada',
      };
    }

    if (s === 0) {
      return {
        primary: '#71717a',
        bg: 'transparent',
        border: '#e4e4e7',
        icon: currentTier.icon,
        label: currentTier.label,
      };
    }

    if (s >= 7) {
      return {
        primary: '#ea580c',
        bg: '#ea580c10',
        border: '#ea580c',
        icon: Flame,
        label: currentTier.label,
      };
    }

    const orangeScale = [
      '#a1a1aa',
      '#fdba74',
      '#fdba74',
      '#fb923c',
      '#fb923c',
      '#f97316',
      '#f97316',
    ];
    const color = orangeScale[s] || '#f97316';

    return {
      primary: color,
      bg: `${color}10`,
      border: color,
      icon: Flame,
      label: currentTier.label,
    };
  }, [user.streak, restDays, currentTier]);

  const StatusIcon = streakStyles.icon;

  return (
    <View>
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
            <View
              className="h-[52px] w-[52px] items-center justify-center rounded-full p-[3px]"
              style={{
                backgroundColor: userThemeColor,
                shadowColor: userThemeColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 8,
              }}>
              <Avatar
                alt="User"
                className="h-full w-full overflow-hidden rounded-full border-2 border-background bg-background">
                <AvatarImage
                  source={{ uri: user.avatarUri || 'https://github.com/shadcn.png' }}
                  className="h-full w-full rounded-full"
                  resizeMode="cover"
                />
                <AvatarFallback className="items-center justify-center rounded-full bg-muted">
                  <Text className="font-bold text-muted-foreground">US</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-foreground">{user.name}</Text>
            <Text className="text-xs text-muted-foreground">
              Nível {user.level} • {user.totalXp} XP
            </Text>
          </View>
        </View>
        <ThemeToggle />
      </View>

      <View className="mb-4 gap-4">
        <View
          className="rounded-xl p-4"
          style={{
            borderWidth: 1,
            borderColor: streakStyles.border,
            backgroundColor: streakStyles.bg,
          }}>
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="rounded-full p-2.5"
                style={{
                  backgroundColor: user.streak === 0 ? '#f4f4f5' : `${streakStyles.primary}20`,
                }}>
                <StatusIcon size={24} color={streakStyles.primary} fill={streakStyles.primary} />
              </View>

              <View>
                <Text className="text-2xl font-bold leading-tight text-foreground">
                  {user.streak}{' '}
                  <Text className="text-sm font-normal text-muted-foreground">dias seguidos</Text>
                </Text>
                <Text className="text-xs font-bold" style={{ color: streakStyles.primary }}>
                  {streakStyles.label}{' '}
                  {!restDays?.includes(dayjs().format('YYYY-MM-DD')) && nextTier
                    ? `• Faltam ${nextTier.days - user.streak} para subir`
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          <Separator className="mb-4 bg-border/50" />

          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            tierColor={streakStyles.primary}
            restDays={restDays}
          />
        </View>

        <View className="gap-2 px-1">
          <View className="flex-row justify-between">
            <Text className="text-xs font-medium text-muted-foreground">Nível {user.level}</Text>
            <Text className="text-xs font-bold" style={{ color: userThemeColor }}>
              {Math.floor(progressPercentage)}%
            </Text>
          </View>

          <View className="h-2.5 overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full"
              style={{ width: `${progressPercentage}%`, backgroundColor: userThemeColor }}
            />
          </View>

          <Text className="text-right text-[10px] text-muted-foreground">
            {1000 - xpCurrentLevel} XP para o próximo nível
          </Text>
        </View>
      </View>
    </View>
  );
}
