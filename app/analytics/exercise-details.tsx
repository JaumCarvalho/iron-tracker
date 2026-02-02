import React, { useState, useCallback, memo, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Svg,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';
import dayjs from 'dayjs';
import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ChevronLeft,
  Trophy,
  TrendingUp,
  Calendar,
  Dumbbell,
  Activity,
  Timer,
  MapPin,
} from 'lucide-react-native';

type TimeRange = '7d' | '30d' | '1y' | 'all';
const ITEMS_PER_PAGE = 15;

const FilterButton = memo(
  ({
    label,
    value,
    current,
    onPress,
  }: {
    label: string;
    value: TimeRange;
    current: TimeRange;
    onPress: (v: TimeRange) => void;
  }) => (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className={`rounded-md border px-3 py-1.5 ${current === value ? 'border-primary bg-primary' : 'border-transparent bg-transparent'}`}>
      <Text
        className={`text-xs font-bold ${current === value ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  )
);

const StatsCard = memo(({ icon: Icon, label, value, color }: any) => (
  <View
    className="min-w-[45%] flex-1 rounded-xl border bg-card p-3"
    style={{ borderColor: `${color}30`, backgroundColor: `${color}10` }}>
    <View className="mb-1 flex-row items-center gap-2">
      <Icon size={14} color={color} />
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
    </View>
    <Text className="text-lg font-bold text-foreground">{value}</Text>
  </View>
));

const LogItem = memo(
  ({ log, themeColor, isCardio }: { log: any; themeColor: string; isCardio: boolean }) => {
    const dateFormatted = dayjs(log.date).format('dddd, DD [de] MMM, YYYY');

    return (
      <View
        className={`mb-3 rounded-xl border bg-card p-4 ${log.isAnchor ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: log.isAnchor ? themeColor : '#71717a' }}
            />
            <Text
              className={`font-bold capitalize ${log.isAnchor ? 'text-primary' : 'text-foreground'}`}>
              {dateFormatted} {log.isAnchor}
            </Text>
          </View>
          <Text className="text-xs font-medium text-muted-foreground">
            {isCardio ? `Total: ${log.value.toFixed(1)}km` : `Max: ${log.value}kg`}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {log.sets.map((set: any, sIdx: number) => (
            <View
              key={sIdx}
              className="flex-row items-center gap-1 rounded border border-border/30 bg-muted/30 px-2 py-1">
              {isCardio ? (
                <>
                  <Text className="font-bold text-foreground">{set.distance || 0}km</Text>
                  <Text className="text-xs text-muted-foreground">
                    • {set.manualDuration || 0}m
                  </Text>
                </>
              ) : (
                <>
                  <Text className="font-bold text-foreground">{set.weight}kg</Text>
                  <Text className="text-xs text-muted-foreground">x {set.reps}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

const PerformanceChart = memo(({ data, color, unit, isLoading }: any) => {
  const [width, setWidth] = useState(0);

  if (data.length < 2) {
    return (
      <View className="h-40 items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/10">
        <Text className="px-4 text-center text-xs text-muted-foreground">
          {isLoading ? 'Carregando...' : 'Dados insuficientes para gráfico.'}
        </Text>
      </View>
    );
  }

  const height = 160;
  const padding = 20;
  const chartWidth = width || 300;

  let maxVal = Math.max(...data.map((d: any) => d.value));
  if (maxVal === 0) maxVal = 10;
  const minVal = 0;

  const points = data.map((d: any, i: number) => {
    const x = padding + i * ((chartWidth - padding * 2) / (data.length - 1));
    const ratio = (d.value - minVal) / (maxVal - minVal);
    const y = height - ratio * (height - padding) - 10;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p: any, i: number) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} className="mt-4">
      <Svg height={height + 30} width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d={`${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
          fill="url(#grad)"
        />
        <Path d={linePath} stroke={color} strokeWidth="2" fill="transparent" />

        {points.map((p: any, i: number) => {
          const isSelected = p.isAnchor;
          const shouldShowDot = isSelected || points.length < 15 || i === points.length - 1;
          if (!shouldShowDot) return null;

          return (
            <G key={i} x={p.x} y={p.y}>
              {isSelected && <Circle r="8" fill={color} opacity={0.3} />}
              <Circle
                r={isSelected ? 5 : 3}
                fill={isSelected ? color : 'white'}
                stroke={color}
                strokeWidth={2}
              />
              {(isSelected || i === points.length - 1) && (
                <SvgText
                  y="-12"
                  fontSize={isSelected ? '12' : '10'}
                  fill={color}
                  textAnchor="middle"
                  fontWeight="bold">
                  {p.value}
                  {unit}
                </SvgText>
              )}
            </G>
          );
        })}

        {points.map((p: any, i: number) => {
          const show =
            i === 0 ||
            i === points.length - 1 ||
            (points.length > 5 && i === Math.floor(points.length / 2));
          if (!show) return null;
          return (
            <SvgText
              key={i}
              x={p.x}
              y={height + 20}
              fontSize="10"
              fill="#71717a"
              textAnchor="middle">
              {p.dateFormatted}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
});

function useExerciseAnalytics(history: any[], name: string, anchorDate: string) {
  const [state, setState] = useState({
    isLoading: true,
    baseLogs: [] as any[],
    group: 'Geral',
    isCardio: false,
    stats: null as any,
  });

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!history || !name) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      const logs: any[] = [];
      let globalMax = 0;
      let globalVol = 0;
      let totalSets = 0;
      let groupName = 'Geral';
      let isCardio = false;

      const limitDate = anchorDate ? dayjs(anchorDate) : dayjs();

      for (const workout of history) {
        const wDate = dayjs(workout.date);
        if (wDate.isAfter(limitDate, 'day')) continue;

        const exercise = workout.exercises.find((ex: any) => ex.name === name);
        if (exercise) {
          groupName = exercise.group || 'Geral';
          isCardio = groupName === 'Cardio';

          let sessionVal = 0;
          let sessionVol = 0;

          if (isCardio) {
            sessionVal = exercise.sets.reduce(
              (acc: number, s: any) => acc + (parseFloat(s.distance) || 0),
              0
            );
            sessionVol = exercise.sets.reduce(
              (acc: number, s: any) => acc + (parseFloat(s.manualDuration) || 0),
              0
            );
          } else {
            for (const s of exercise.sets) {
              const w = Number(s.weight) || 0;
              const r = Number(s.reps) || 0;
              if (w > sessionVal) sessionVal = w;
              sessionVol += w * r;
            }
          }

          if (sessionVal > globalMax) globalMax = sessionVal;
          globalVol += sessionVol;
          totalSets += exercise.sets.length;

          logs.push({
            date: workout.date,
            rawDateObj: wDate,
            workoutId: workout.id,
            value: sessionVal,
            sets: exercise.sets,
            isAnchor: wDate.isSame(limitDate, 'day'),
          });
        }
      }

      logs.sort((a, b) => b.rawDateObj.valueOf() - a.rawDateObj.valueOf());

      setState({
        isLoading: false,
        baseLogs: logs,
        group: groupName,
        isCardio,
        stats: {
          max: globalMax,
          vol: globalVol,
          count: logs.length,
          sets: totalSets,
        },
      });
    });
    return () => task.cancel();
  }, [history, name, anchorDate]);

  return state;
}

export default function ExerciseDetails() {
  const { name, anchorDate } = useLocalSearchParams<{ name: string; anchorDate: string }>();
  const { history, user } = useStore();
  const [filter, setFilter] = useState<TimeRange>('30d');

  const { baseLogs, group, isCardio, stats, isLoading } = useExerciseAnalytics(
    history,
    name,
    anchorDate
  );

  const [visibleLogs, setVisibleLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (isLoading || baseLogs.length === 0) return;

    const limit = anchorDate ? dayjs(anchorDate) : dayjs();
    let cutOff = limit.clone();
    if (filter === '7d') cutOff = cutOff.subtract(7, 'day');
    else if (filter === '30d') cutOff = cutOff.subtract(30, 'day');
    else if (filter === '1y') cutOff = cutOff.subtract(1, 'year');
    else cutOff = dayjs('1900-01-01');

    const filtered = baseLogs.filter(
      (log) => log.rawDateObj.isSame(cutOff, 'day') || log.rawDateObj.isAfter(cutOff, 'day')
    );

    const chart = [...filtered]
      .sort((a, b) => a.rawDateObj.valueOf() - b.rawDateObj.valueOf())
      .map((log) => ({
        value: log.value,
        dateFormatted: dayjs(log.date).format('DD/MM'),
        isAnchor: log.isAnchor,
      }));
    setChartData(chart);

    setPage(1);
    const batch = filtered.slice(0, ITEMS_PER_PAGE);
    setVisibleLogs(batch);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [baseLogs, filter, isLoading, anchorDate]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const allFiltered = baseLogs;

    const limit = anchorDate ? dayjs(anchorDate) : dayjs();
    let cutOff = limit.clone();
    if (filter === '7d') cutOff = cutOff.subtract(7, 'day');
    else if (filter === '30d') cutOff = cutOff.subtract(30, 'day');
    else if (filter === '1y') cutOff = cutOff.subtract(1, 'year');
    else cutOff = dayjs('1900-01-01');

    const filtered = baseLogs.filter(
      (log) => log.rawDateObj.isSame(cutOff, 'day') || log.rawDateObj.isAfter(cutOff, 'day')
    );
    const end = nextPage * ITEMS_PER_PAGE;
    setVisibleLogs(filtered.slice(0, end));
    setPage(nextPage);
    setHasMore(filtered.length > end);
  }, [page, hasMore, baseLogs, filter, anchorDate]);

  const themeColor = useMemo(() => {
    if (isCardio) return '#3b82f6';
    const tiers = [
      { d: 1825, c: '#10b981' },
      { d: 365, c: '#fbbf24' },
      { d: 0, c: '#a1a1aa' },
    ];
    return tiers.find((t) => user.streak >= t.d)?.c || '#a1a1aa';
  }, [user.streak, isCardio]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="z-10 flex-row items-center gap-4 border-b border-border bg-card px-4 pb-4 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-muted/50 p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-xs font-bold uppercase" style={{ color: themeColor }}>
            {group}
          </Text>
        </View>
      </View>

      <FlatList
        data={visibleLogs}
        keyExtractor={(item) => item.workoutId}
        renderItem={({ item }) => (
          <LogItem log={item} themeColor={themeColor} isCardio={isCardio} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        ListHeaderComponent={
          <View className="mb-4">
            <View className="mb-4 flex-row justify-end gap-2 self-end rounded-lg bg-muted/20 p-1">
              {(['7d', '30d', '1y', 'all'] as TimeRange[]).map((r) => (
                <FilterButton
                  key={r}
                  label={r === 'all' ? 'Tudo' : r.toUpperCase()}
                  value={r}
                  current={filter}
                  onPress={setFilter}
                />
              ))}
            </View>

            <Card className="mb-6 border-border/50 bg-card/50">
              <CardHeader className="flex-row items-center gap-2 pb-0">
                <TrendingUp size={18} color={themeColor} />
                <Text className="text-base font-bold text-foreground">
                  {isCardio ? 'Evolução de Distância' : 'Evolução de Carga'}
                </Text>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  data={chartData}
                  color={themeColor}
                  unit={isCardio ? 'km' : 'kg'}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            <View className="mb-6 flex-row flex-wrap gap-3">
              <StatsCard
                icon={Trophy}
                label={isCardio ? 'Maior Distância' : 'Recorde (PR)'}
                value={`${stats?.max || 0}${isCardio ? 'km' : 'kg'}`}
                color={themeColor}
              />
              <StatsCard
                icon={isCardio ? Timer : Activity}
                label={isCardio ? 'Tempo Total' : 'Vol. Máximo'}
                value={isCardio ? `${(stats?.vol || 0).toFixed(0)}min` : `${stats?.vol || 0}kg`}
                color={themeColor}
              />
              <StatsCard
                icon={Calendar}
                label="Sessões"
                value={stats?.count || 0}
                color={themeColor}
              />
              <StatsCard
                icon={isCardio ? MapPin : Dumbbell}
                label={isCardio ? 'Dist. Total' : 'Total Séries'}
                value={isCardio ? `${stats?.max * stats?.count || 0}km` : stats?.sets || 0}
                color={themeColor}
              />
            </View>
            <Text className="mb-2 text-lg font-bold text-foreground">Histórico</Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View className="py-4">
              <ActivityIndicator color={themeColor} />
            </View>
          ) : (
            <View className="h-8" />
          )
        }
      />
    </View>
  );
}
