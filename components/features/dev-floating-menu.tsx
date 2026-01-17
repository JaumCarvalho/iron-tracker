import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import dayjs from 'dayjs';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

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

const useDevMenuLogic = (setVisible: (v: boolean) => void) => {
  const store = useStore();
  const { addDevLog, seedData, toggleRestDay } = store;

  const stressTest = () => {
    addDevLog('Iniciando Stress Test (500 dias)...');
    setTimeout(() => {
      seedData(500);
      addDevLog('Stress Test concluído.');
      setVisible(false);
    }, 100);
  };

  const seedOneWeek = () => {
    seedData(7);
    addDevLog('Seed aplicado: 1 Semana de histórico.');
    setVisible(false);
  };

  const handleInjectRest = (daysBack: number) => {
    const targetDate = dayjs().subtract(daysBack, 'day');
    toggleRestDay(targetDate.toISOString());
    addDevLog(`Rest Day alterado para: ${targetDate.format('DD/MM')}`);
  };

  const createGapScenario = () => {
    const today = dayjs();
    const yesterdayStr = today.subtract(1, 'day').format('YYYY-MM-DD');
    const dayBeforeStr = today.subtract(2, 'day').format('YYYY-MM-DD');

    const currentHistory = [...useStore.getState().history].filter(
      (h) => !h.date.startsWith(yesterdayStr)
    );
    const currentRestDays = [...useStore.getState().restDays].filter((d) => d !== yesterdayStr);

    const createDummyWorkout = (dateObj: dayjs.Dayjs) => ({
      id: Math.random().toString(),
      date: dateObj.toISOString(),
      durationSeconds: 3600,
      xpEarned: 150,
      exercises: [
        {
          exerciseId: 'dev-ex-manual',
          name: 'Supino Dev',
          group: 'Peito',
          sets: [{ weight: 40, reps: 10, completed: true, distance: 0, duration: 0 }],
        },
      ],
    });

    if (!currentHistory.some((h) => h.date.startsWith(today.format('YYYY-MM-DD')))) {
      currentHistory.push(createDummyWorkout(today));
    }
    if (!currentHistory.some((h) => h.date.startsWith(dayBeforeStr))) {
      currentHistory.push(createDummyWorkout(today.subtract(2, 'day')));
    }

    useStore.setState((state) => ({
      history: currentHistory,
      restDays: currentRestDays,
      user: { ...state.user, totalXp: currentHistory.length * 150 },
    }));

    useStore.getState().checkStreak();
    addDevLog('Cenário criado: Buraco em "Ontem".');
    setVisible(false);
  };

  return {
    stressTest,
    seedOneWeek,
    handleInjectRest,
    createGapScenario,
    ...store,
  };
};

const SectionHeader = ({
  title,
  color = 'text-muted-foreground',
}: {
  title: string;
  color?: string;
}) => <Text className={`mb-3 mt-4 text-xs font-bold uppercase ${color}`}>{title}</Text>;

const ToolsPanel = ({ logic }: { logic: ReturnType<typeof useDevMenuLogic> }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      <SectionHeader title="Cenários & Dados" color="text-primary" />
      <View className="gap-2">
        <Button
          variant="outline"
          onPress={logic.seedOneWeek}
          className="flex-row justify-start border-primary/30 bg-primary/5">
          <Database size={16} className="mr-2 text-primary" />
          <Text className="font-bold text-primary">Popular 1 Semana (Seed)</Text>
        </Button>

        <Button
          variant="outline"
          onPress={logic.createGapScenario}
          className="flex-row justify-start border-dashed border-foreground/30">
          <AlertTriangle size={16} className="mr-2 text-foreground" />
          <Text>Criar "Buraco" (Ontem sem treino)</Text>
        </Button>

        <Button
          className="flex-row justify-start bg-blue-600"
          onPress={() => logic.handleInjectRest(1)}>
          <CalendarClock size={16} color="white" className="mr-2" />
          <Text className="text-white">Toggle Descanso (Ontem)</Text>
        </Button>
      </View>

      <SectionHeader title="Limpeza Granular" />
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          onPress={logic.clearHistoryOnly}
          className="h-auto flex-1 flex-col border border-border py-3">
          <History size={16} className="mb-1 text-foreground" />
          <Text className="text-[10px]">Histórico</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={logic.clearProfileOnly}
          className="h-auto flex-1 flex-col border border-border py-3">
          <UserX size={16} className="mb-1 text-foreground" />
          <Text className="text-[10px]">Perfil/XP</Text>
        </Button>
      </View>

      <SectionHeader title="Danger Zone" color="text-red-500" />
      <View className="mb-8 flex-row gap-2">
        <Button variant="destructive" onPress={logic.stressTest} className="flex-1 bg-yellow-600">
          <Zap size={16} color="white" className="mr-2" />
          <Text>Stress (500)</Text>
        </Button>
        <Button
          variant="destructive"
          onPress={() => {
            Alert.alert('Reset Total', 'Isso apagará TODOS os dados. Confirmar?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sim, Resetar', onPress: logic.resetData, style: 'destructive' },
            ]);
          }}
          className="flex-1">
          <Trash2 size={16} color="white" className="mr-2" />
          <Text>Reset Total</Text>
        </Button>
      </View>

      <View className="items-center pb-8 opacity-50">
        <Text className="font-mono text-[10px]">
          User: {logic.user.name} | Level: {logic.user.level} | Streak: {logic.user.streak}
        </Text>
      </View>
    </ScrollView>
  );
};

const LogsPanel = ({ logs, clearLogs }: { logs: string[]; clearLogs: () => void }) => {
  return (
    <View className="flex-1 bg-zinc-950 p-4">
      <View className="mb-4 flex-row items-center justify-between border-b border-white/10 pb-2">
        <View className="flex-row items-center gap-2">
          <Terminal size={16} color="#4ade80" />
          <Text className="font-mono text-xs text-green-400">System Logs</Text>
        </View>
        <Text className="font-mono text-[10px] text-zinc-500">{logs.length} linhas</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text className="mb-1 border-b border-white/5 pb-1 font-mono text-[10px] text-green-400/80">
            {`> ${item}`}
          </Text>
        )}
        ListEmptyComponent={
          <View className="mt-10 items-center opacity-50">
            <Text className="text-zinc-500">_aguardando input...</Text>
          </View>
        }
      />

      <Button
        variant="ghost"
        className="mt-4 border border-white/20 active:bg-white/10"
        onPress={clearLogs}>
        <Eraser size={14} color="white" className="mr-2" />
        <Text className="text-xs text-white">Limpar Console</Text>
      </Button>
    </View>
  );
};

export function DevFloatingMenu() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'logs'>('tools');
  const { colorScheme } = useColorScheme();

  const logic = useDevMenuLogic(setVisible);
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#000000' : '#fafafa';

  if (!visible) {
    return (
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="absolute bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full border border-border bg-primary shadow-lg"
        activeOpacity={0.8}
        style={{ elevation: 5 }}>
        <Wrench color={iconColor} size={24} />
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="h-[75%] w-full overflow-hidden rounded-t-3xl border-t border-border bg-background shadow-2xl">
          <View className="flex-row items-center justify-between border-b border-border bg-muted/20 p-5">
            <View className="flex-row items-center gap-3">
              <View className="rounded-lg bg-primary/10 p-2">
                <Wrench className="text-primary" size={20} />
              </View>
              <View>
                <Text className="text-lg font-bold text-foreground">Dev Console</Text>
                <Text className="text-[10px] text-muted-foreground">v2.1 - Data Management</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="h-8 w-8 items-center justify-center rounded-full bg-muted active:bg-muted/80">
              <X size={18} className="text-foreground" />
            </TouchableOpacity>
          </View>

          <View className="flex-row border-b border-border bg-background">
            <TouchableOpacity
              onPress={() => setActiveTab('tools')}
              className={`flex-1 flex-row items-center justify-center gap-2 border-b-2 p-4 ${
                activeTab === 'tools' ? 'border-primary bg-primary/5' : 'border-transparent'
              }`}>
              <Database
                size={16}
                className={activeTab === 'tools' ? 'text-primary' : 'text-muted-foreground'}
              />
              <Text
                className={`font-bold ${activeTab === 'tools' ? 'text-primary' : 'text-muted-foreground'}`}>
                Ferramentas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('logs')}
              className={`flex-1 flex-row items-center justify-center gap-2 border-b-2 p-4 ${
                activeTab === 'logs' ? 'border-primary bg-primary/5' : 'border-transparent'
              }`}>
              <Terminal
                size={16}
                className={activeTab === 'logs' ? 'text-primary' : 'text-muted-foreground'}
              />
              <Text
                className={`font-bold ${activeTab === 'logs' ? 'text-primary' : 'text-muted-foreground'}`}>
                Logs
                {logic.devLogs.length > 0 && (
                  <Text className="text-[10px] font-normal"> ({logic.devLogs.length})</Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 bg-background">
            {activeTab === 'tools' ? (
              <ToolsPanel logic={logic} />
            ) : (
              <LogsPanel
                logs={logic.devLogs}
                clearLogs={() => useStore.setState({ devLogs: [] })}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
