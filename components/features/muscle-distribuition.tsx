import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Svg, {
  G,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BicepsFlexed, ChevronRight, X, TrendingUp } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import dayjs from 'dayjs';

const STREAK_TIERS = [
  { days: 1825, color: '#10b981' },
  { days: 1095, color: '#ec4899' },
  { days: 730, color: '#06b6d4' },
  { days: 365, color: '#fbbf24' },
  { days: 180, color: '#3b82f6' },
  { days: 90, color: '#8b5cf6' },
  { days: 30, color: '#ef4444' },
  { days: 7, color: '#f97316' },
  { days: 0, color: '#a1a1aa' },
];

const COLORS: Record<string, string> = {
  Pernas: '#f97316',
  Peito: '#0ea5e9',
  Costas: '#10b981',
  Ombros: '#eab308',
  Abdômen: '#ef4444',
  Braços: '#8b5cf6',
  Outros: '#71717a',
};

type TimeRange = 'week' | 'month' | 'all';

export function MuscleDistribution() {
  const { history, user } = useStore();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const tierColor = useMemo(() => {
    const tier =
      STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
    return tier.color;
  }, [user.streak]);

  const startDate = useMemo(() => {
    const today = dayjs();
    if (timeRange === 'week') return today.subtract(6, 'day');
    if (timeRange === 'month') return today.subtract(29, 'day');
    return null;
  }, [timeRange]);

  const { stats, exerciseBreakdown, totalSets } = useMemo(() => {
    const s: Record<string, number> = {};
    const eb: Record<string, Record<string, number>> = {};
    let ts = 0;

    history.forEach((session) => {
      const sessionDate = dayjs(session.date);
      if (startDate && sessionDate.isBefore(startDate, 'day')) return;

      session.exercises.forEach((ex) => {
        if (ex.group === 'Cardio') return;

        const group = ex.group || 'Outros';
        const sets = ex.sets.length;
        s[group] = (s[group] || 0) + sets;
        ts += sets;

        if (!eb[group]) eb[group] = {};
        eb[group][ex.name] = (eb[group][ex.name] || 0) + sets;
      });
    });
    return { stats: s, exerciseBreakdown: eb, totalSets: ts };
  }, [history, startDate]);
  const sortedStats = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .filter(([, val]) => val > 0);

  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  let currentAngle = 0;

  const donutData = sortedStats.map(([key, value]) => {
    const percentage = totalSets > 0 ? value / totalSets : 0;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const rotate = currentAngle * 360;
    const color = COLORS[key] || COLORS['Outros'];
    currentAngle += percentage;
    return { key, value, percent: percentage, strokeDasharray, rotate, color };
  });

  const lineChartData = useMemo(() => {
    if (!selectedMuscle) return [];

    const sessions = history
      .filter((h) => {
        const sessionDate = dayjs(h.date);
        if (startDate && sessionDate.isBefore(startDate, 'day')) return false;

        return h.exercises.some((ex) => ex.group === selectedMuscle);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sessions.map((session) => {
      const exercises = session.exercises.filter((ex) => ex.group === selectedMuscle);

      let maxWeight = 0;
      let repsAtMaxWeight = 0;

      exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          if (set.weight > maxWeight) {
            maxWeight = set.weight;
            repsAtMaxWeight = set.reps;
          }
        });
      });

      return {
        date: dayjs(session.date).format('DD/MM'),
        weight: maxWeight,
        reps: repsAtMaxWeight,
      };
    });
  }, [history, selectedMuscle, startDate]);

  const FilterButton = ({ label, value }: { label: string; value: TimeRange }) => (
    <TouchableOpacity
      onPress={() => setTimeRange(value)}
      className={`rounded-md border px-2 py-1 ${
        timeRange === value ? 'border-primary bg-primary' : 'border-transparent bg-transparent'
      }`}>
      <Text
        className={`text-[10px] font-bold ${
          timeRange === value ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLineChart = () => {
    if (lineChartData.length < 2)
      return (
        <View className="items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20 py-6">
          <Text className="text-xs text-muted-foreground">Dados insuficientes neste período.</Text>
        </View>
      );

    const height = 100;
    const padding = 20;
    const width = chartWidth || 300;

    let rawMaxWeight = Math.max(...lineChartData.map((d) => d.weight));
    if (rawMaxWeight === 0) rawMaxWeight = 10;

    const maxWeight = rawMaxWeight * 1.1;
    const minWeight = 0;

    const points = lineChartData.map((d, i) => {
      const x = padding + i * ((width - padding * 2) / (lineChartData.length - 1));
      const ratio = (d.weight - minWeight) / (maxWeight - minWeight);
      const y = height - ratio * (height - padding) - 10;
      return { x, y, ...d };
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');
    const chartColor = COLORS[selectedMuscle!] || COLORS['Outros'];

    return (
      <View
        className="mt-4"
        onLayout={(e: LayoutChangeEvent) => setChartWidth(e.nativeEvent.layout.width)}>
        <View className="mb-2 flex-row items-center gap-2">
          <TrendingUp size={16} color={chartColor} />
          <Text className="text-sm font-bold text-foreground">Evolução de Carga Máxima</Text>
        </View>

        <Svg height={height + 30} width="100%">
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={chartColor} stopOpacity="0.5" />
              <Stop offset="1" stopColor={chartColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <Path
            d={`${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
            fill="url(#gradient)"
          />
          <Path d={linePath} stroke={chartColor} strokeWidth="3" fill="transparent" />

          {points.map((p, i) => (
            <G key={i} x={p.x} y={p.y}>
              <Circle r="4" fill="white" stroke={chartColor} strokeWidth="2" />
              {(i === points.length - 1 || points.length < 10) && (
                <>
                  <SvgText
                    y="-10"
                    fontSize="10"
                    fill={chartColor}
                    textAnchor="middle"
                    fontWeight="bold">
                    {p.weight}kg
                  </SvgText>
                  <SvgText y="15" fontSize="8" fill="gray" textAnchor="middle">
                    {p.reps}
                  </SvgText>
                </>
              )}
            </G>
          ))}

          {points.map((p, i) => {
            const showLabel =
              points.length < 7 ||
              i === 0 ||
              i === points.length - 1 ||
              i === Math.floor(points.length / 2);
            if (!showLabel) return null;

            return (
              <SvgText
                key={`date-${i}`}
                x={p.x}
                y={height + 20}
                fontSize="10"
                fill="#71717a"
                textAnchor="middle">
                {p.date}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    );
  };

  const renderDetails = () => {
    if (!selectedMuscle) return null;

    const exercises = Object.entries(exerciseBreakdown[selectedMuscle] || {}).sort(
      ([, a], [, b]) => b - a
    );

    const muscleColor = COLORS[selectedMuscle] || 'gray';

    return (
      <View className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold" style={{ color: muscleColor }}>
            {selectedMuscle}
          </Text>
          <TouchableOpacity onPress={() => setSelectedMuscle(null)}>
            <X size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {renderLineChart()}

        <View className="my-4 h-px bg-border/50" />

        <Text className="mb-2 text-xs font-bold uppercase text-muted-foreground">
          Exercícios Frequentes
        </Text>
        {exercises.map(([name, sets], idx) => (
          <View
            key={name}
            className="flex-row justify-between border-b border-border/50 py-1.5 last:border-0">
            <Text className="flex-1 text-sm text-foreground">
              {idx + 1}. {name}
            </Text>
            <Text className="text-sm font-bold text-muted-foreground">{sets} séries</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Card className="mt-6 w-full border-border/50 bg-card/80">
      <CardHeader className="pb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <BicepsFlexed size={18} color={tierColor} />

            <Text className="text-base font-bold text-foreground">
              Distribuição{' '}
              <Text className="text-xs font-normal text-muted-foreground">
                ({timeRange === 'week' ? '7 Dias' : timeRange === 'month' ? '30 Dias' : 'Total'})
              </Text>
            </Text>
          </View>

          <View className="flex-row rounded-lg bg-muted/50 p-0.5">
            <FilterButton label="7D" value="week" />
            <FilterButton label="30D" value="month" />
            <FilterButton label="Total" value="all" />
          </View>
        </View>
      </CardHeader>

      <CardContent>
        {totalSets === 0 ? (
          <View className="h-40 items-center justify-center">
            <Text className="text-muted-foreground">Sem dados neste período.</Text>
          </View>
        ) : (
          <View className="flex-row items-start">
            <View className="relative mr-6 items-center justify-center">
              <View className="-rotate-90 transform">
                <Svg height="140" width="140" viewBox="0 0 140 140">
                  <G rotation={0} origin="70, 70">
                    <Circle
                      cx="70"
                      cy="70"
                      r={radius}
                      stroke="#e4e4e7"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    {donutData.map((item) => (
                      <Circle
                        key={item.key}
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke={item.color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={item.strokeDasharray}
                        strokeDashoffset={0}
                        rotation={item.rotate}
                        origin="70, 70"
                        strokeLinecap="round"
                      />
                    ))}
                  </G>
                </Svg>
              </View>

              <View className="absolute inset-0 items-center justify-center">
                <Text className="text-2xl font-bold text-foreground">
                  {selectedMuscle ? stats[selectedMuscle] : totalSets}
                </Text>
                <Text className="text--[10px] font-bold uppercase text-muted-foreground">
                  {selectedMuscle ? 'Séries' : 'Total'}
                </Text>
              </View>
            </View>

            <View className="flex-1 gap-2">
              {donutData.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelectedMuscle(selectedMuscle === item.key ? null : item.key)}
                  className={`flex-row items-center justify-between rounded-lg border p-2 ${selectedMuscle === item.key ? 'border-primary/30 bg-muted' : 'border-transparent'}`}>
                  <View className="flex-1 flex-row items-center gap-2">
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text
                      className={`text-xs font-medium ${selectedMuscle === item.key ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {item.key}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="mr-1 text-xs font-bold text-foreground">
                      {(item.percent * 100).toFixed(0)}%
                    </Text>
                    {selectedMuscle === item.key && (
                      <ChevronRight size={12} className="text-muted-foreground" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {renderDetails()}
      </CardContent>
    </Card>
  );
}
