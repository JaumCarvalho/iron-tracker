import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutChangeEvent,
  ActivityIndicator,
  InteractionManager,
  FlatList,
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
  Plus,
} from 'lucide-react-native';

const ITEMS_PER_PAGE = 15;

type TimeRange = '7d' | '30d' | '1y' | 'all';

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

const LogItem = memo(
  ({ log, themeColor, isAnchor }: { log: any; themeColor: string; isAnchor: boolean }) => {
    const dateFormatted = dayjs(log.date).format('dddd, DD [de] MMM, YYYY');

    return (
      <View
        className={`mb-3 rounded-xl border bg-card p-4 ${isAnchor ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: isAnchor ? themeColor : '#71717a' }}
            />
            <Text
              className={`font-bold capitalize ${isAnchor ? 'text-primary' : 'text-foreground'}`}>
              {dateFormatted} {isAnchor && '(Selecionado)'}
            </Text>
          </View>
          <Text className="text-xs font-medium text-muted-foreground">Max {log.maxWeight}kg</Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {log.sets.map((set: any, sIdx: number) => (
            <View key={sIdx} className="rounded border border-border/30 bg-muted/30 px-2 py-1">
              <Text className="text-xs text-muted-foreground">
                <Text className="font-bold text-foreground">{set.weight}kg</Text> x {set.reps}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
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

export default function ExerciseDetails() {
  const { name, anchorDate } = useLocalSearchParams<{ name: string; anchorDate: string }>();
  const { history, user } = useStore();
  const [chartWidth, setChartWidth] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TimeRange>('30d');

  const [baseLogs, setBaseLogs] = useState<any[]>([]);
  const [group, setGroup] = useState('Geral');
  const [globalStats, setGlobalStats] = useState<any>(null);

  const [filteredChartData, setFilteredChartData] = useState<any[]>([]);
  const [visibleLogs, setVisibleLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreLogs, setHasMoreLogs] = useState(false);

  const themeColor = useMemo(() => {
    const tiers = [
      { d: 1825, c: '#10b981' },
      { d: 1095, c: '#ec4899' },
      { d: 730, c: '#06b6d4' },
      { d: 365, c: '#fbbf24' },
      { d: 180, c: '#3b82f6' },
      { d: 90, c: '#8b5cf6' },
      { d: 30, c: '#ef4444' },
      { d: 7, c: '#f97316' },
      { d: 0, c: '#a1a1aa' },
    ];
    return tiers.find((t) => user.streak >= t.d)?.c || '#a1a1aa';
  }, [user.streak]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!history || !name) {
        setIsLoading(false);
        return;
      }

      const logs: any[] = [];
      let maxWeightAllTime = 0;
      let maxVolumeAllTime = 0;
      let totalSetsAllTime = 0;
      let groupName = 'Geral';

      const limitDate = anchorDate ? dayjs(anchorDate) : dayjs();

      for (const workout of history) {
        const wDate = dayjs(workout.date);

        if (wDate.isAfter(limitDate, 'day')) continue;

        const exercise = workout.exercises.find((ex: any) => ex.name === name);
        if (exercise) {
          groupName = exercise.group || 'Geral';

          let sessionMax = 0;
          let sessionVol = 0;

          for (const s of exercise.sets) {
            const w = Number(s.weight) || 0;
            const r = Number(s.reps) || 0;
            if (w > sessionMax) sessionMax = w;
            sessionVol += w * r;
          }

          if (sessionMax > maxWeightAllTime) maxWeightAllTime = sessionMax;
          if (sessionVol > maxVolumeAllTime) maxVolumeAllTime = sessionVol;
          totalSetsAllTime += exercise.sets.length;

          logs.push({
            date: workout.date,
            rawDateObj: wDate,
            workoutId: workout.id,
            maxWeight: sessionMax,
            sets: exercise.sets,

            isAnchor: wDate.isSame(limitDate, 'day'),
          });
        }
      }

      logs.sort((a, b) => b.rawDateObj.valueOf() - a.rawDateObj.valueOf());

      setBaseLogs(logs);
      setGlobalStats({
        pr: maxWeightAllTime,
        maxVolume: maxVolumeAllTime,
        totalSets: totalSetsAllTime,
        sessions: logs.length,
      });
      setGroup(groupName);
      setIsLoading(false);
    });

    return () => task.cancel();
  }, [history, name, anchorDate]);

  useEffect(() => {
    if (baseLogs.length === 0) return;

    const limitDate = anchorDate ? dayjs(anchorDate) : dayjs();
    let cutOffDate = limitDate.clone();

    if (filter === '7d') cutOffDate = cutOffDate.subtract(7, 'day');
    else if (filter === '30d') cutOffDate = cutOffDate.subtract(30, 'day');
    else if (filter === '1y') cutOffDate = cutOffDate.subtract(1, 'year');
    else cutOffDate = dayjs('1900-01-01');

    const logsInPeriod = baseLogs.filter((log) => {
      return log.rawDateObj.isSame(cutOffDate, 'day') || log.rawDateObj.isAfter(cutOffDate, 'day');
    });

    const chartPoints = [...logsInPeriod]
      .sort((a, b) => a.rawDateObj.valueOf() - b.rawDateObj.valueOf())
      .map((log) => ({
        dateFormatted: dayjs(log.date).format('DD/MM'),
        weight: log.maxWeight,
        isAnchor: log.isAnchor,
      }));

    setFilteredChartData(chartPoints);

    setPage(1);
    const initialBatch = logsInPeriod.slice(0, ITEMS_PER_PAGE);
    setVisibleLogs(initialBatch);
    setHasMoreLogs(logsInPeriod.length > ITEMS_PER_PAGE);
  }, [filter, baseLogs, anchorDate]);

  const handleLoadMore = useCallback(() => {
    const limitDate = anchorDate ? dayjs(anchorDate) : dayjs();
    let cutOffDate = limitDate.clone();
    if (filter === '7d') cutOffDate = cutOffDate.subtract(7, 'day');
    else if (filter === '30d') cutOffDate = cutOffDate.subtract(30, 'day');
    else if (filter === '1y') cutOffDate = cutOffDate.subtract(1, 'year');
    else cutOffDate = dayjs('1900-01-01');

    const logsInPeriod = baseLogs.filter(
      (log) => log.rawDateObj.isSame(cutOffDate, 'day') || log.rawDateObj.isAfter(cutOffDate, 'day')
    );

    const nextPage = page + 1;
    const nextBatchEnd = nextPage * ITEMS_PER_PAGE;
    const nextBatch = logsInPeriod.slice(0, nextBatchEnd);

    setVisibleLogs(nextBatch);
    setPage(nextPage);
    setHasMoreLogs(logsInPeriod.length > nextBatchEnd);
  }, [page, baseLogs, filter, anchorDate]);

  const renderChart = useCallback(() => {
    if (filteredChartData.length < 2)
      return (
        <View className="h-40 items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/10">
          <Text className="px-4 text-center text-xs text-muted-foreground">
            Poucos dados neste período ({filter.toUpperCase()}).
          </Text>
        </View>
      );

    const height = 160;
    const padding = 20;
    const width = chartWidth || 300;

    let maxVal = Math.max(...filteredChartData.map((d) => d.weight));
    if (maxVal === 0) maxVal = 10;
    const minVal = 0;

    const points = filteredChartData.map((d, i) => {
      const x = padding + i * ((width - padding * 2) / (filteredChartData.length - 1));
      const ratio = (d.weight - minVal) / (maxVal - minVal);
      const y = height - ratio * (height - padding) - 10;
      return { x, y, ...d };
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    return (
      <View
        onLayout={(e: LayoutChangeEvent) => setChartWidth(e.nativeEvent.layout.width)}
        className="mt-4">
        <Svg height={height + 30} width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={themeColor} stopOpacity="0.4" />
              <Stop offset="1" stopColor={themeColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d={`${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
            fill="url(#grad)"
          />
          <Path d={linePath} stroke={themeColor} strokeWidth="2" fill="transparent" />

          {points.map((p, i) => {
            const isSelected = p.isAnchor;
            const shouldShowDot = isSelected || points.length < 15 || i === points.length - 1;

            if (!shouldShowDot) return null;

            return (
              <G key={i} x={p.x} y={p.y}>
                {isSelected && <Circle r="8" fill={themeColor} opacity={0.3} />}
                <Circle
                  r={isSelected ? 5 : 3}
                  fill={isSelected ? themeColor : 'white'}
                  stroke={themeColor}
                  strokeWidth={2}
                />
                {(isSelected || i === points.length - 1) && (
                  <SvgText
                    y="-12"
                    fontSize={isSelected ? '12' : '10'}
                    fill={themeColor}
                    textAnchor="middle"
                    fontWeight="bold">
                    {p.weight}kg
                  </SvgText>
                )}
              </G>
            );
          })}

          {points.map((p, i) => {
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
  }, [filteredChartData, chartWidth, themeColor, filter]);

  const ListHeader = useCallback(
    () => (
      <View className="mb-4">
        <View className="mb-4 flex-row justify-end gap-2 self-end rounded-lg bg-muted/20 p-1">
          <FilterButton label="7D" value="7d" current={filter} onPress={setFilter} />
          <FilterButton label="30D" value="30d" current={filter} onPress={setFilter} />
          <FilterButton label="1 Ano" value="1y" current={filter} onPress={setFilter} />
          <FilterButton label="Tudo" value="all" current={filter} onPress={setFilter} />
        </View>

        {/* Gráfico */}
        <Card className="mb-6 border-border/50 bg-card/50">
          <CardHeader className="pb-0">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={18} color={themeColor} />
              <Text className="text-base font-bold text-foreground">
                Evolução até {anchorDate ? dayjs(anchorDate).format('DD/MM') : 'hoje'}
              </Text>
            </View>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>

        {/* Stats */}
        <View className="mb-6 flex-row flex-wrap gap-3">
          <StatsCard
            icon={Trophy}
            label="Recorde (PR)"
            value={`${globalStats?.pr || 0}kg`}
            color={themeColor}
          />
          <StatsCard
            icon={Activity}
            label="Vol. Máximo"
            value={`${globalStats?.maxVolume || 0}kg`}
            color={themeColor}
          />
          <StatsCard
            icon={Calendar}
            label="Sessões"
            value={globalStats?.sessions || 0}
            color={themeColor}
          />
          <StatsCard
            icon={Dumbbell}
            label="Total Séries"
            value={globalStats?.totalSets || 0}
            color={themeColor}
          />
        </View>

        <Text className="mb-2 text-lg font-bold text-foreground">Histórico do Período</Text>
      </View>
    ),
    [filter, renderChart, globalStats, themeColor, anchorDate]
  );

  const ListFooter = useCallback(() => {
    if (!hasMoreLogs) return <View className="h-8" />;

    return (
      <TouchableOpacity
        onPress={handleLoadMore}
        className="my-4 flex-row items-center justify-center rounded-xl border border-border bg-muted/20 p-3 active:bg-muted/40">
        <Plus size={16} className="mr-2 text-muted-foreground" />
        <Text className="text-sm font-bold text-muted-foreground">Carregar mais 15 sessões</Text>
      </TouchableOpacity>
    );
  }, [hasMoreLogs, handleLoadMore]);

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
          <LogItem log={item} themeColor={themeColor} isAnchor={item.isAnchor} />
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        initialNumToRender={8}
        removeClippedSubviews={true}
        windowSize={5}
      />
    </View>
  );
}
