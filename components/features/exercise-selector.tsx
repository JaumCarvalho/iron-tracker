import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { X, ChevronRight, ArrowLeft, Dumbbell, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EXERCISE_DATABASE, MuscleGroup } from '@/lib/exercises';

interface ExerciseSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (name: string, group: string) => void;
}

export function ExerciseSelector({ visible, onClose, onSelect }: ExerciseSelectorProps) {
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [customSearch, setCustomSearch] = useState('');

  const handleClose = () => {
    setSelectedGroup(null);
    setCustomSearch('');
    onClose();
  };

  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group as MuscleGroup);
  };

  const handleSelectExercise = (exercise: string) => {
    if (selectedGroup) {
      onSelect(exercise, selectedGroup);
      handleClose();
    }
  };

  const renderGroupItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between border-b border-border py-4"
      onPress={() => handleSelectGroup(item)}>
      <View className="flex-row items-center gap-3">
        <View className="rounded-lg bg-primary/10 p-2">
          <Dumbbell size={20} className="text-primary" />
        </View>
        <Text className="text-lg font-semibold">{item}</Text>
      </View>
      <ChevronRight size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );

  const renderExerciseItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="border-b border-border py-4"
      onPress={() => handleSelectExercise(item)}>
      <Text className="text-base">{item}</Text>
    </TouchableOpacity>
  );

  const groups = Object.keys(EXERCISE_DATABASE);
  const exercises = selectedGroup
    ? EXERCISE_DATABASE[selectedGroup].filter((ex) =>
        ex.toLowerCase().includes(customSearch.toLowerCase())
      )
    : [];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-border p-4">
          <View className="flex-row items-center gap-2">
            {selectedGroup && (
              <Button variant="ghost" size="icon" onPress={() => setSelectedGroup(null)}>
                <ArrowLeft size={24} className="text-foreground" />
              </Button>
            )}
            <Text className="text-lg font-bold">
              {selectedGroup ? selectedGroup : 'Selecione o Grupo'}
            </Text>
          </View>
          <Button variant="ghost" size="icon" onPress={handleClose}>
            <X size={24} className="text-muted-foreground" />
          </Button>
        </View>

        {!selectedGroup ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item}
            renderItem={renderGroupItem}
            contentContainerStyle={{ padding: 16 }}
          />
        ) : (
          <View className="flex-1">
            <View className="p-4 pb-2">
              <Input
                placeholder={`Buscar em ${selectedGroup}...`}
                value={customSearch}
                onChangeText={setCustomSearch}
                className="border-transparent bg-muted/50"
              />
            </View>

            <FlatList
              data={exercises}
              keyExtractor={(item) => item}
              renderItem={renderExerciseItem}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
              ListFooterComponent={() =>
                customSearch.length > 0 && !exercises.includes(customSearch) ? (
                  <TouchableOpacity
                    className="mt-2 flex-row items-center gap-3 py-4"
                    onPress={() => handleSelectExercise(customSearch)}>
                    <View className="rounded-full bg-primary/10 p-2">
                      <Plus size={20} className="text-primary" />
                    </View>
                    <View>
                      <Text className="font-bold text-primary">Criar "{customSearch}"</Text>
                      <Text className="text-xs text-muted-foreground">
                        Adicionar em {selectedGroup}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
