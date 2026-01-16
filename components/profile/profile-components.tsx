import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Flame, Trophy, Dumbbell, Coffee } from 'lucide-react-native';

export const ProfileHeader = memo(
  ({ user, name, setName, isEditing, setIsEditing, onSave, onPickImage }: any) => {
    return (
      <View className="mt-6 items-center px-6">
        <View className="relative">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPickImage}
            className="relative h-28 w-28 rounded-full border-4 border-primary bg-background p-1">
            <Avatar className="h-full w-full" alt="User Avatar">
              <AvatarImage source={{ uri: user.avatarUri || 'https://github.com/shadcn.png' }} />
              <AvatarFallback>
                <Text>US</Text>
              </AvatarFallback>
            </Avatar>

            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/30 opacity-0 active:opacity-100">
              <Camera color="white" size={24} />
            </View>
          </TouchableOpacity>

          <View className="absolute bottom-0 right-0 z-10 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary">
            <Text className="text-xs font-bold text-white">{user.level}</Text>
          </View>

          <TouchableOpacity
            onPress={onPickImage}
            className="absolute bottom-0 left-0 z-10 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted">
            <Camera size={14} className="text-foreground" />
          </TouchableOpacity>
        </View>

        {!isEditing ? (
          <View className="mt-4 items-center">
            <Text className="text-2xl font-bold text-foreground">{user.name}</Text>
            <Text className="text-sm text-muted-foreground">Membro desde 2024</Text>
            <Button variant="ghost" className="mt-2 h-8 px-4" onPress={() => setIsEditing(true)}>
              <Text className="text-xs font-bold text-primary">Editar Perfil</Text>
            </Button>
          </View>
        ) : (
          <View className="mt-4 w-full gap-3">
            <Input value={name} onChangeText={setName} placeholder="Seu nome" autoFocus />
            <View className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onPress={() => setIsEditing(false)}>
                <Text>Cancelar</Text>
              </Button>
              <Button className="flex-1" onPress={onSave}>
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

export const StatsGrid = memo(({ stats }: { stats: any }) => {
  return (
    <View className="mt-8 flex-row flex-wrap gap-3 px-6">
      <StatCard
        icon={<Flame size={20} className="text-orange-500" />}
        value={stats.streak}
        label="Ofensiva"
      />
      <StatCard
        icon={<Trophy size={20} className="text-yellow-500" />}
        value={stats.xp}
        label="Total XP"
      />
      <StatCard
        icon={<Dumbbell size={20} className="text-primary" />}
        value={stats.workouts}
        label="Treinos"
      />
      <StatCard
        icon={<Coffee size={20} className="text-blue-500" />}
        value={stats.restDays}
        label="Descansos"
      />
    </View>
  );
});

const StatCard = ({ icon, value, label }: any) => (
  <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
    {icon}
    <View className="items-center">
      <Text className="text-xl font-bold text-foreground">{value}</Text>
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  </View>
);
