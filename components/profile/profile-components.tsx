import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Flame, Trophy, Dumbbell, Coffee, Check, Palette } from 'lucide-react-native';
import { STREAK_TIERS } from '@/lib/constants';

const AVAILABLE_COLORS = STREAK_TIERS.map((t) => t.color);

export const ColorThemeSelector = ({
  currentColor,
  onSelectColor,
}: {
  currentColor: string;
  onSelectColor: (c: string) => void;
}) => {
  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <View className="mb-3 flex-row items-center gap-2">
        <Palette size={20} color={currentColor} />
        <View>
          <Text className="font-bold text-foreground">Cor do Tema</Text>
          <Text className="text-xs text-muted-foreground">Personalize a cor principal do app</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-start gap-3">
        {AVAILABLE_COLORS.map((color) => {
          const isSelected = currentColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.7}
              className="items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: color,
                borderWidth: isSelected ? 3 : 0,
                borderColor: 'rgba(255,255,255,0.8)',
                shadowColor: color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {isSelected && <Check size={16} color="white" strokeWidth={3} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const ProfileHeader = memo(
  ({
    user,
    name,
    setName,
    isEditing,
    setIsEditing,
    onSave,
    onPickImage,
    accentColor = '#a1a1aa',
  }: any) => {
    return (
      <View className="mt-6 items-center px-6">
        <View className="relative">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPickImage}
            className="relative h-28 w-28 rounded-full border-4 bg-background p-1"
            style={{ borderColor: accentColor }}>
            <Avatar className="h-full w-full" alt="User Avatar">
              <AvatarImage source={{ uri: user.avatarUri || 'https://github.com/shadcn.png' }} />
              <AvatarFallback>
                <Text>US</Text>
              </AvatarFallback>
            </Avatar>
          </TouchableOpacity>

          <View
            className="absolute bottom-0 right-0 z-10 h-8 w-8 items-center justify-center rounded-full border-2 border-background"
            style={{ backgroundColor: accentColor }}>
            <Text className="text-xs font-bold text-white">{user.level}</Text>
          </View>
        </View>

        {!isEditing ? (
          <View className="mt-4 items-center">
            <Text className="text-2xl font-bold text-foreground">{user.name}</Text>
            <Text className="text-sm text-muted-foreground">Membro desde 2024</Text>

            <Button variant="ghost" className="mt-2 h-8 px-4" onPress={() => setIsEditing(true)}>
              <Text className="text-xs font-bold" style={{ color: accentColor }}>
                Editar Perfil
              </Text>
            </Button>
          </View>
        ) : (
          <View className="mt-4 w-full gap-3">
            <Input value={name} onChangeText={setName} placeholder="Seu nome" autoFocus />
            <View className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onPress={() => setIsEditing(false)}>
                <Text>Cancelar</Text>
              </Button>

              <Button className="flex-1" onPress={onSave} style={{ backgroundColor: accentColor }}>
                <Save size={16} color="white" className="mr-2" />
                <Text>Salvar</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
);

export const StatsGrid = memo(
  ({ stats, accentColor = '#a1a1aa' }: { stats: any; accentColor?: string }) => {
    return (
      <View className="mt-8 flex-row flex-wrap gap-3 px-6">
        <StatCard
          icon={<Flame size={20} color={accentColor} />}
          value={stats.streak}
          label="Ofensiva"
        />
        <StatCard
          icon={<Trophy size={20} color={accentColor} />}
          value={stats.xp}
          label="Total XP"
        />
        <StatCard
          icon={<Dumbbell size={20} color={accentColor} />}
          value={stats.workouts}
          label="Treinos"
        />
        <StatCard
          icon={<Coffee size={20} color={accentColor} />}
          value={stats.restDays}
          label="Descansos"
        />
      </View>
    );
  }
);

const StatCard = ({ icon, value, label }: any) => (
  <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
    {icon}
    <View className="items-center">
      <Text className="text-xl font-bold text-foreground">{value}</Text>
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  </View>
);
