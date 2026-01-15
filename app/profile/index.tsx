import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useColorScheme } from 'nativewind';
import {
  ChevronLeft,
  Trophy,
  Dumbbell,
  Clock,
  Calendar,
  Lock,
  Crown,
  Star,
  Zap,
  Flame,
} from 'lucide-react-native';

const STREAK_TIERS = [
  {
    days: 1825,
    label: 'TITÃ',
    color: '#10b981',
    icon: Crown,
    desc: '5 Anos de disciplina inabalável.',
  },
  { days: 1095, label: 'IMORTAL', color: '#ec4899', icon: Crown, desc: '3 Anos. Uma lenda viva.' },
  { days: 730, label: 'MITO', color: '#06b6d4', icon: Star, desc: '2 Anos de constância.' },
  {
    days: 365,
    label: 'LENDÁRIO',
    color: '#fbbf24',
    icon: Trophy,
    desc: '1 Ano completo. A elite.',
  },
  { days: 180, label: 'SUPERNOVA', color: '#3b82f6', icon: Zap, desc: '6 Meses. Brilhando forte.' },
  {
    days: 90,
    label: 'INFERNAL',
    color: '#8b5cf6',
    icon: Flame,
    desc: '3 Meses. O hábito está formado.',
  },
  { days: 30, label: 'INCÊNDIO', color: '#ef4444', icon: Flame, desc: '1 Mês. O fogo começou.' },
  {
    days: 7,
    label: 'EM CHAMAS',
    color: '#f97316',
    icon: Flame,
    desc: '1 Semana. O início da jornada.',
  },
  { days: 0, label: 'FAGULHA', color: '#a1a1aa', icon: Flame, desc: 'O primeiro passo.' },
];

export default function ProfileScreen() {
  const { user, history } = useStore();
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#ffffff' : '#09090b';
  const mutedIconColor = isDark ? '#a1a1aa' : '#71717a';
  const stats = useMemo(() => {
    let totalVolume = 0;
    let totalSeconds = 0;

    history.forEach((workout) => {
      totalSeconds += workout.durationSeconds;
      workout.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        });
      });
    });

    const hours = Math.floor(totalSeconds / 3600);
    const tonnage =
      totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)} Ton` : `${totalVolume} kg`;

    return { hours, tonnage, workouts: history.length };
  }, [history]);

  const currentTier = useMemo(() => {
    return STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
  }, [user.streak]);

  const xpCurrentLevel = user.totalXp % 1000;
  const xpPercentage = (xpCurrentLevel / 1000) * 100;

  return (
    <View className="flex-1 bg-background">
      <View className="z-10 flex-row items-center justify-between px-4 pb-2 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-muted/50 p-2">
          <ChevronLeft size={24} color={iconColor} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Perfil</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="mb-8 mt-4 items-center">
          <View
            className="mb-4 h-28 w-28 items-center justify-center rounded-full p-[3px]"
            style={{
              backgroundColor: currentTier.color,
              shadowColor: currentTier.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 15,
              elevation: 10,
            }}>
            <Avatar alt="User" className="h-full w-full rounded-full border-4 border-background">
              <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
              <AvatarFallback className="bg-muted">
                <Text className="text-2xl font-bold text-muted-foreground">US</Text>
              </AvatarFallback>
            </Avatar>
          </View>

          <Text className="text-2xl font-bold text-foreground">{user.name}</Text>
          <Text
            className="mb-1 text-sm font-bold uppercase tracking-widest"
            style={{ color: currentTier.color }}>
            {currentTier.label} • {user.streak} Dias
          </Text>

          <View className="mt-2 w-48 gap-1">
            <View className="flex-row justify-between">
              <Text className="text-[10px] font-bold text-muted-foreground">
                Nível {user.level}
              </Text>
              <Text className="text-[10px] font-bold text-muted-foreground">
                {Math.floor(xpPercentage)}%
              </Text>
            </View>
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <View
                className="h-full rounded-full bg-foreground"
                style={{ width: `${xpPercentage}%` }}
              />
            </View>
          </View>
        </View>

        <View className="mb-10 flex-row justify-between px-6">
          <View className="items-center">
            <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Calendar size={18} color={iconColor} />
            </View>
            <Text className="text-lg font-bold text-foreground">{stats.workouts}</Text>
            <Text className="text-[10px] uppercase text-muted-foreground">Treinos</Text>
          </View>
          <View className="items-center">
            <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Clock size={18} color={iconColor} />
            </View>
            <Text className="text-lg font-bold text-foreground">{stats.hours}h</Text>
            <Text className="text-[10px] uppercase text-muted-foreground">Tempo Total</Text>
          </View>
          <View className="items-center">
            <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Dumbbell size={18} color={iconColor} />
            </View>
            <Text className="text-lg font-bold text-foreground">{stats.tonnage}</Text>
            <Text className="text-[10px] uppercase text-muted-foreground">Carga Total</Text>
          </View>
        </View>

        <View className="px-6">
          <Text className="mb-6 text-lg font-bold text-foreground">Sua Jornada</Text>

          {STREAK_TIERS.map((tier, index) => {
            const isUnlocked = user.streak >= tier.days;
            const isCurrent = currentTier.days === tier.days;
            const Icon = tier.icon;
            const isLast = index === STREAK_TIERS.length - 1;

            return (
              <View key={tier.days} className="flex-row">
                <View className="mr-4 w-8 items-center">
                  <View
                    className={`z-10 h-8 w-8 items-center justify-center rounded-full border-2 bg-background ${
                      isUnlocked ? '' : 'border-muted'
                    }`}
                    style={
                      isUnlocked
                        ? {
                            borderColor: tier.color,
                            backgroundColor: isCurrent ? `${tier.color}20` : undefined,
                          }
                        : {}
                    }>
                    {isUnlocked ? (
                      <Icon size={14} color={tier.color} />
                    ) : (
                      <Lock size={12} color={mutedIconColor} />
                    )}
                  </View>

                  {!isLast && <View className="my-1 w-[2px] flex-1 bg-border/50" />}
                </View>

                <View className={`flex-1 pb-8 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text
                      className="text-base font-bold"
                      style={isUnlocked ? { color: tier.color } : { color: 'gray' }}>
                      {tier.label}
                    </Text>
                    {isCurrent && (
                      <View
                        className="rounded-full px-2 py-0.5"
                        style={{ backgroundColor: tier.color }}>
                        <Text className="text-[10px] font-bold text-white">ATUAL</Text>
                      </View>
                    )}
                  </View>

                  <Text className="mb-1 text-xs font-bold text-foreground">
                    {tier.days} Dias de Ofensiva
                  </Text>
                  <Text className="text-xs leading-snug text-muted-foreground">{tier.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
