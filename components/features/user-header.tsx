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

interface UserHeaderProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
}

export function UserHeader({ selectedDate, onSelectDate }: UserHeaderProps) {
  const { user } = useStore();

  const currentTier = useMemo(() => {
    return STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
  }, [user.streak]);

  const nextTier = useMemo(() => {
    return STREAK_TIERS.slice()
      .reverse()
      .find((t) => t.days > user.streak);
  }, [user.streak]);

  const IconComponent = currentTier.icon;
  const xpCurrentLevel = user.totalXp % 1000;
  const progressPercentage = (xpCurrentLevel / 1000) * 100;

  return (
    <View>
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
            <View
              className="h-[52px] w-[52px] items-center justify-center rounded-full p-[3px]"
              style={{
                backgroundColor: currentTier.color,
                shadowColor: currentTier.color,
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
        <View className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className={`rounded-full p-2.5 ${currentTier.bgLight} ${currentTier.bgDark}`}>
                <IconComponent size={24} color={currentTier.color} fill={currentTier.color} />
              </View>

              <View>
                <Text className="text-2xl font-bold leading-tight text-foreground">
                  {user.streak}{' '}
                  <Text className="text-sm font-normal text-muted-foreground">dias seguidos</Text>
                </Text>
                <Text className="text-xs font-bold" style={{ color: currentTier.color }}>
                  {currentTier.label}{' '}
                  {nextTier ? `• Faltam ${nextTier.days - user.streak} para subir` : ''}
                </Text>
              </View>
            </View>
          </View>

          <Separator className="mb-4" />

          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            tierColor={currentTier.color}
          />
        </View>

        <View className="gap-2 px-1">
          <View className="flex-row justify-between">
            <Text className="text-xs font-medium text-muted-foreground">Nível {user.level}</Text>
            <Text className="text-xs font-bold" style={{ color: currentTier.color }}>
              {Math.floor(progressPercentage)}%
            </Text>
          </View>

          <View className="h-2.5 overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full"
              style={{ width: `${progressPercentage}%`, backgroundColor: currentTier.color }}
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
