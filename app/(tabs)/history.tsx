import React, { useMemo, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { WorkoutHistoryItem } from '@/components/features/workout-history-item';
import { Search, CalendarX, Filter, X } from 'lucide-react-native';
import dayjs from 'dayjs';

const PERIODS = [
  { label: 'Tudo', value: 'all' },
  { label: '7 Dias', value: 'week' },
  { label: '30 Dias', value: 'month' },
  { label: 'Este Ano', value: 'year' },
];

const MUSCLE_GROUPS = [
  'Todos',
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Abdômen',
  'Cardio',
];

const ITEMS_PER_PAGE = 15;

export default function HistoryScreen() {
  const { history } = useStore();

  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredHistory = useMemo(() => {
    if (!history) return [];

    const now = dayjs();

    return history.filter((workout) => {
      if (!workout.date) return false;
      const workoutDate = dayjs(workout.date);

      const matchesSearch =
        search === '' ||
        (workout.exercises &&
          workout.exercises.some(
            (ex: any) => ex.name && ex.name.toLowerCase().includes(search.toLowerCase())
          ));

      let matchesPeriod = true;
      if (selectedPeriod === 'week') {
        const weekAgo = now.subtract(7, 'day');
        matchesPeriod = workoutDate.isAfter(weekAgo) || workoutDate.isSame(weekAgo, 'day');
      } else if (selectedPeriod === 'month') {
        const monthAgo = now.subtract(30, 'day');
        matchesPeriod = workoutDate.isAfter(monthAgo) || workoutDate.isSame(monthAgo, 'day');
      } else if (selectedPeriod === 'year') {
        const startOfYear = now.startOf('year');
        matchesPeriod = workoutDate.isAfter(startOfYear) || workoutDate.isSame(startOfYear, 'day');
      }

      let matchesMuscle = true;
      if (selectedMuscle !== 'Todos') {
        matchesMuscle =
          workout.exercises && workout.exercises.some((ex: any) => ex.group === selectedMuscle);
      }

      return matchesSearch && matchesPeriod && matchesMuscle;
    });
  }, [history, search, selectedPeriod, selectedMuscle]);

  const paginatedData = useMemo(() => {
    return filteredHistory.slice(0, displayCount);
  }, [filteredHistory, displayCount]);

  const hasMore = displayCount < filteredHistory.length;

  const renderItem = ({ item }: { item: any }) => <WorkoutHistoryItem workout={item} />;

  const keyExtractor = (item: any) => item.id;

  const onSelectPeriod = (val: string) => {
    setSelectedPeriod(val);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const onSelectMuscle = (val: string) => {
    setSelectedMuscle(val);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const onClearFilters = () => {
    setSearch('');
    setSelectedPeriod('all');
    setSelectedMuscle('Todos');
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const onLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const hasActiveFilters = search !== '' || selectedPeriod !== 'all' || selectedMuscle !== 'Todos';

  const renderFooter = () => {
    if (!hasMore) return null;

    if (isLoadingMore) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color="#888" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={onLoadMore}
        className="my-4 items-center rounded-lg border border-border bg-card py-3">
        <Text className="text-sm font-medium text-primary">
          Carregar mais ({filteredHistory.length - displayCount} restantes)
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="mt-10 items-center justify-center opacity-50">
      <View style={{ marginBottom: 16 }}>
        <CalendarX size={48} color="#888" />
      </View>
      <Text className="text-lg font-bold text-muted-foreground">Nenhum treino encontrado.</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="px-4 pb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Histórico</Text>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={onClearFilters}
              className="flex-row items-center rounded-md bg-destructive/10 px-2 py-1">
              <View style={{ marginRight: 4 }}>
                <X size={14} color="#ef4444" />
              </View>
              <Text className="text-xs font-bold text-destructive">Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mb-4 h-12 flex-row items-center rounded-xl border border-input bg-card px-3">
          <View style={{ marginRight: 8 }}>
            <Search size={20} color="#888" />
          </View>
          <Input
            className="h-12 flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground"
            placeholder="Buscar exercício..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View>
          <View className="mb-2 flex-row items-center gap-2">
            <Filter size={14} color="#0ea5e9" />
            <Text className="text-xs font-bold uppercase text-muted-foreground">Filtrar por</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
            {MUSCLE_GROUPS.map((muscle) => (
              <TouchableOpacity
                key={muscle}
                onPress={() => onSelectMuscle(muscle)}
                className={`rounded-full border px-3 py-1.5 ${selectedMuscle === muscle ? 'border-primary bg-primary' : 'border-border bg-card'}`}>
                <Text
                  className={`text-xs font-medium ${selectedMuscle === muscle ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {muscle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={{
              marginTop: 4,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#f5f5f5',
              padding: 4,
              borderRadius: 8,
            }}>
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period.value}
                onPress={() => {
                  console.log('Clicou em:', period.value);
                  setSelectedPeriod(period.value);
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 6,
                  backgroundColor: selectedPeriod === period.value ? '#fff' : 'transparent',
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: selectedPeriod === period.value ? '#000' : '#888',
                  }}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text className="mb-2 mt-4 text-xs text-muted-foreground">
          Exibindo {paginatedData.length} de {filteredHistory.length} treinos
        </Text>
      </View>

      <FlatList
        data={paginatedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
