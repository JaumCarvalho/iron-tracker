import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Play, Hourglass, MoreVertical, Plus, Timer, MapPin } from 'lucide-react-native';

export const SetRow = memo(({ set, index, onUpdate, onInteraction, onRemove, isCardio }: any) => {
  const getBorderColor = () => {
    if (set.status !== 'completed') return 'border-transparent';
    if (set.isExtra) return 'border-blue-500';
    if (isCardio) return 'border-green-500';

    const targetMax = parseInt(set.targetReps?.split('-').pop() || '0');
    const actual = parseInt(set.reps || '0');
    if (targetMax > 0 && actual < targetMax) return 'border-yellow-500';
    return 'border-green-500';
  };

  const renderIcon = () => {
    switch (set.status) {
      case 'idle':
        return <Play size={16} color="#a1a1aa" fill="#a1a1aa" />;
      case 'working':
        return <Hourglass size={16} className="text-primary" />;
      case 'completed':
        return <Check size={18} color="white" />;
    }
  };

  return (
    <View className="relative">
      {set.isExtra && (
        <View className="absolute -left-3 top-3 h-4 w-1.5 rounded-r-full bg-blue-500" />
      )}

      <View
        className={`flex-row items-center gap-3 rounded-lg border p-1.5 ${getBorderColor()} ${set.status === 'working' ? 'border-primary bg-primary/5' : 'bg-background'}`}>
        <TouchableOpacity
          onPress={() => onInteraction(index)}
          className={`h-9 w-10 items-center justify-center rounded-md border ${
            set.status === 'completed'
              ? 'border-green-600 bg-green-500'
              : set.status === 'working'
                ? 'border-primary bg-primary/10'
                : 'border-input bg-muted'
          }`}>
          {renderIcon()}
        </TouchableOpacity>

        {isCardio ? (
          <>
            <View className="relative flex-1 justify-center">
              <Input
                className={`h-10 border-transparent bg-transparent text-center text-lg font-bold ${set.status === 'completed' ? 'text-foreground' : ''}`}
                keyboardType="numeric"
                placeholder="km"
                value={set.distance}
                onChangeText={(t: string) => onUpdate(index, 'distance', t)}
                selectTextOnFocus
              />
              {!set.distance && (
                <MapPin size={10} className="absolute right-2 text-muted-foreground/30" />
              )}
            </View>

            <View className="relative flex-1 justify-center">
              <Input
                className={`h-10 border-transparent bg-transparent text-center text-lg font-bold ${set.status === 'completed' ? 'text-foreground' : ''}`}
                keyboardType="numeric"
                placeholder="min"
                value={set.duration}
                onChangeText={(t: string) => onUpdate(index, 'duration', t)}
                selectTextOnFocus
              />
              {!set.duration && (
                <Timer size={10} className="absolute right-2 text-muted-foreground/30" />
              )}
            </View>
          </>
        ) : (
          <>
            <Input
              className={`h-10 flex-1 border-transparent bg-transparent text-center text-lg font-bold ${set.status === 'completed' ? 'text-foreground' : ''}`}
              keyboardType="numeric"
              placeholder="-"
              value={set.weight}
              onChangeText={(t: string) => onUpdate(index, 'weight', t)}
              selectTextOnFocus
            />

            <View className="relative flex-1 justify-center">
              {set.targetReps && set.status !== 'completed' && !set.reps && (
                <Text className="absolute top-0.5 self-center text-[10px] text-muted-foreground/40">
                  /{set.targetReps}
                </Text>
              )}
              <Input
                className={`h-10 border-transparent bg-transparent text-center text-lg font-bold ${set.status === 'completed' ? 'text-foreground' : ''}`}
                keyboardType="numeric"
                placeholder={set.targetReps || '-'}
                placeholderTextColor="#52525b"
                value={set.reps}
                onChangeText={(t: string) => onUpdate(index, 'reps', t)}
                selectTextOnFocus
              />
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() => onRemove(index)}
          className="h-8 w-8 items-center justify-center opacity-50">
          <MoreVertical size={16} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export const ExerciseCard = memo(
  ({
    exercise,
    exIndex,
    onRemoveExercise,
    onSetInteraction,
    onUpdateSet,
    onAddSet,
    onRemoveSet,
  }: any) => {
    const isCardio = exercise.group === 'Cardio';

    return (
      <View
        className={`mb-4 overflow-hidden rounded-xl border bg-card ${exercise.isExtra ? 'border-blue-500/30' : 'border-border'}`}>
        <View className="flex-row items-center justify-between border-b border-border bg-muted/30 p-3">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-foreground">{exercise.name}</Text>
              {exercise.isExtra && (
                <View className="rounded bg-blue-500 px-1.5 py-0.5">
                  <Text className="text-[8px] font-bold text-white">EXTRA</Text>
                </View>
              )}
            </View>
            <Text className="text-xs font-bold uppercase text-primary">{exercise.group}</Text>
          </View>
          <TouchableOpacity onPress={() => onRemoveExercise(exIndex)} className="p-2">
            <MoreVertical size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        <View className="gap-2 p-3">
          <View className="mb-1 flex-row items-center px-1">
            <Text className="w-10 text-center text-[10px] font-bold text-muted-foreground">
              STATUS
            </Text>
            {isCardio ? (
              <>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] font-bold text-muted-foreground">
                    DISTÂNCIA (KM)
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] font-bold text-muted-foreground">TEMPO (MIN)</Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] font-bold text-muted-foreground">CARGA (KG)</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] font-bold text-muted-foreground">REPS</Text>
                </View>
              </>
            )}
            <View className="w-8" />
          </View>

          {exercise.sets.map((set: any, setIndex: number) => (
            <SetRow
              key={set.id}
              set={set}
              index={setIndex}
              isCardio={isCardio}
              onInteraction={(sIdx: number) => onSetInteraction(exIndex, sIdx)}
              onUpdate={(sIdx: number, f: string, v: string) => onUpdateSet(exIndex, sIdx, f, v)}
              onRemove={(sIdx: number) => onRemoveSet(exIndex, sIdx)}
            />
          ))}

          <Button
            variant="ghost"
            className="mt-2 h-8 border border-dashed border-border"
            onPress={() => onAddSet(exIndex)}>
            <Plus size={14} className="mr-2 text-primary" />
            <Text className="text-xs text-primary">Adicionar Série Extra</Text>
          </Button>
        </View>
      </View>
    );
  }
);
