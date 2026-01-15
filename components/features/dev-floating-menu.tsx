import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import { useColorScheme } from 'nativewind';
import dayjs from 'dayjs';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { SIMULATION_OPTIONS } from '@/lib/constants';

import {
  Wrench,
  X,
  Database,
  Zap,
  Trash2,
  CalendarClock,
  Eraser,
  Terminal,
  UserX,
  History,
  AlertTriangle,
} from 'lucide-react-native';

export function DevFloatingMenu() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'logs'>('tools');

  const {
    user,
    resetData,
    seedData,
    history,
    toggleRestDay,
    clearHistoryOnly,
    clearProfileOnly,
    devLogs,
    addDevLog,
  } = useStore();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const iconColor = isDark ? '#000000' : '#fafafa';

  const setStreak = (days: number) => {
    useStore.setState((state) => ({
      user: { ...state.user, streak: days },
    }));
    addDevLog(`Streak forçado para ${days} dias.`);
    setVisible(false);
  };

  const stressTest = () => {
    addDevLog('Iniciando Stress Test (500 itens)...');
    setTimeout(() => {
      seedData(500);
      addDevLog('Stress Test concluído.');
    }, 100);
    setVisible(false);
  };

  const handleInjectRest = (daysBack: number) => {
    const targetDate = dayjs().subtract(daysBack, 'day');
    toggleRestDay(targetDate.toISOString());
    addDevLog(`Rest Day alterado para: ${targetDate.format('DD/MM')}`);
  };
  const createDummyWorkout = (dateObj: dayjs.Dayjs) => ({
    id: Math.random().toString(),
    date: dateObj.toISOString(),
    durationSeconds: 3600,
    xpEarned: 150,
    exercises: [
      {
        exerciseId: 'dev-ex-manual-1',
        name: 'Supino Reto (Barra)',
        group: 'Peito',
        sets: [
          {
            weight: 40,
            reps: 10,
            completed: true,
            distance: 0,
            duration: 0,
          },
        ],
      },
    ],
  });
  const createGapScenario = () => {
    const today = dayjs();
    const yesterdayStr = today.subtract(1, 'day').format('YYYY-MM-DD');
    const dayBeforeStr = today.subtract(2, 'day').format('YYYY-MM-DD');

    let currentHistory = [...useStore.getState().history];
    let currentRestDays = [...useStore.getState().restDays];

    currentHistory = currentHistory.filter((h) => !h.date.startsWith(yesterdayStr));

    currentRestDays = currentRestDays.filter((d) => d !== yesterdayStr);

    const hasToday = currentHistory.some((h) => h.date.startsWith(today.format('YYYY-MM-DD')));
    if (!hasToday) {
      currentHistory.push(createDummyWorkout(today));
    }

    const hasDayBefore = currentHistory.some((h) => h.date.startsWith(dayBeforeStr));
    if (!hasDayBefore) {
      currentHistory.push(createDummyWorkout(today.subtract(2, 'day')));
    }

    useStore.setState((state) => ({
      history: currentHistory,
      restDays: currentRestDays,
      user: { ...state.user, totalXp: currentHistory.length * 150 },
    }));

    useStore.getState().checkStreak();

    addDevLog('Cirurgia feita: Treino de ontem removido. Streak deve quebrar.');
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="absolute bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full border border-border bg-primary shadow-lg"
        activeOpacity={0.8}
        style={{ elevation: 5 }}>
        <Wrench color={iconColor} size={24} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/60">
          <View className="h-[80%] flex-1 overflow-hidden rounded-t-3xl border-t border-border bg-background">
            <View className="flex-row items-center justify-between border-b border-border p-6">
              <View className="flex-row items-center gap-2">
                <Wrench className="text-primary" size={20} />
                <Text className="text-xl font-bold text-foreground">Dev Console</Text>
              </View>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="rounded-full bg-muted p-2">
                <X size={20} className="text-foreground" />
              </TouchableOpacity>
            </View>

            <View className="flex-row border-b border-border">
              <TouchableOpacity
                onPress={() => setActiveTab('tools')}
                className={`flex-1 items-center p-3 ${activeTab === 'tools' ? 'border-b-2 border-primary' : ''}`}>
                <Text
                  className={`font-bold ${activeTab === 'tools' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Ferramentas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('logs')}
                className={`flex-1 items-center p-3 ${activeTab === 'logs' ? 'border-b-2 border-primary' : ''}`}>
                <Text
                  className={`font-bold ${activeTab === 'logs' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Logs ({devLogs.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'tools' ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
                <Text className="mb-3 text-xs font-bold uppercase text-primary">
                  🛠️ Teste de Rest Day
                </Text>
                <View className="mb-6 gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <Button
                    variant="outline"
                    onPress={createGapScenario}
                    className="border-dashed border-foreground/30">
                    <AlertTriangle size={16} className="mr-2 text-foreground" />
                    <Text>1. Criar "Buraco" em Ontem</Text>
                  </Button>
                  <Text className="text-center text-[10px] text-muted-foreground">
                    Remove apenas o treino de ontem do histórico atual.
                  </Text>

                  <View className="mt-2 flex-row gap-2">
                    <Button
                      variant="default"
                      className="flex-1 bg-blue-600"
                      onPress={() => handleInjectRest(1)}>
                      <CalendarClock size={16} color="white" className="mr-2" />
                      <Text className="text-white">2. Toggle Ontem</Text>
                    </Button>
                  </View>
                  <Text className="text-center text-[10px] text-muted-foreground">
                    Ao ativar o descanso ontem, a streak deve recuperar o valor total anterior.
                  </Text>
                </View>
                <Text className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                  Popular Dados
                </Text>
                <View className="mb-6 flex-row flex-wrap gap-2">
                  {SIMULATION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.days}
                      onPress={() => {
                        resetData();
                        setTimeout(() => seedData(opt.days), 50);
                        addDevLog(`Seed aplicado: ${opt.label}`);
                        setVisible(false);
                      }}
                      className={`w-[48%] flex-row items-center justify-center rounded-lg border p-3 ${opt.bg} ${opt.border}`}>
                      <Database size={14} className="mr-2 text-foreground" />
                      <Text className={`text-xs font-bold ${opt.color}`}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                  Teste de Lógica (Calendário)
                </Text>
                <View className="mb-6 gap-2 rounded-xl border border-border bg-muted/30 p-3">
                  <View className="flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-500/50"
                      onPress={() => handleInjectRest(1)}>
                      <CalendarClock size={14} className="mr-2 text-blue-500" />
                      <Text className="text-xs">Toggle Ontem</Text>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-500/50"
                      onPress={() => handleInjectRest(2)}>
                      <CalendarClock size={14} className="mr-2 text-blue-500" />
                      <Text className="text-xs">Toggle Anteontem</Text>
                    </Button>
                  </View>
                  <Text className="text-center text-[10px] text-muted-foreground">
                    Use isso para validar se a Streak mantém (com descanso) ou quebra (sem
                    descanso).
                  </Text>
                </View>

                <Text className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                  Teste Visual (Tiers)
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                  {[0, 7, 30, 90, 180, 365, 730, 1095, 1825].map((days) => (
                    <TouchableOpacity
                      key={days}
                      onPress={() => setStreak(days)}
                      className="mr-2 items-center rounded-lg border border-border bg-card px-4 py-3">
                      <Text className="text-sm font-bold text-primary">{days}</Text>
                      <Text className="text-[10px] text-muted-foreground">dias</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                  Limpeza Granular
                </Text>
                <View className="mb-6 gap-2">
                  <Button
                    variant="secondary"
                    onPress={clearHistoryOnly}
                    className="flex-row justify-start">
                    <History size={16} className="mr-2 text-foreground" />
                    <Text>Limpar Apenas Histórico</Text>
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={clearProfileOnly}
                    className="flex-row justify-start">
                    <UserX size={16} className="mr-2 text-foreground" />
                    <Text>Limpar Apenas Perfil/XP</Text>
                  </Button>
                </View>

                <Text className="mb-3 text-xs font-bold uppercase text-red-500">Danger Zone</Text>
                <View className="mb-8 flex-row gap-2">
                  <Button
                    variant="destructive"
                    onPress={stressTest}
                    className="flex-1 bg-yellow-600">
                    <Zap size={16} color="white" className="mr-2" />
                    <Text>Stress (500)</Text>
                  </Button>
                  <Button variant="destructive" onPress={resetData} className="flex-1">
                    <Trash2 size={16} color="white" className="mr-2" />
                    <Text>Factory Reset</Text>
                  </Button>
                </View>

                <View className="items-center pb-8">
                  <Text className="font-mono text-[10px] text-muted-foreground">
                    User ID: {user.name} • XP: {user.totalXp} • Log Size: {history.length}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1 bg-black/90 p-4">
                <View className="mb-4 flex-row items-center gap-2">
                  <Terminal size={16} color="#4ade80" />
                  <Text className="font-mono text-xs text-green-400">System Logs</Text>
                </View>
                <FlatList
                  data={devLogs}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <Text className="mb-1 border-b border-white/10 pb-1 font-mono text-[10px] text-green-400/80">
                      {item}
                    </Text>
                  )}
                  ListEmptyComponent={
                    <Text className="mt-10 text-center text-muted-foreground">
                      Nenhum log registrado.
                    </Text>
                  }
                />
                <Button
                  variant="ghost"
                  className="mt-4 border border-white/20"
                  onPress={() => useStore.setState({ devLogs: [] })}>
                  <Eraser size={14} color="white" className="mr-2" />
                  <Text className="text-xs text-white">Limpar Logs</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
