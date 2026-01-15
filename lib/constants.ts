import { Flame, Trophy, Star, Crown, Zap, Check as CheckIcon } from 'lucide-react-native';

interface StreakTier {
  days: number;
  label: string;
  color: string;
  icon?: any;
  bgLight: string;
  bgDark: string;
}
export const STREAK_TIERS: StreakTier[] = [
  {
    days: 1825,
    label: 'GIGA CHAD PRO MAX',
    color: '#10b981',
    icon: Crown,
    bgLight: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-950',
  },
  {
    days: 1095,
    label: 'TITÃ',
    color: '#ec4899',
    icon: Crown,
    bgLight: 'bg-pink-100',
    bgDark: 'dark:bg-pink-950',
  },
  {
    days: 730,
    label: 'IMORTAL',
    color: '#06b6d4',
    icon: Star,
    bgLight: 'bg-cyan-100',
    bgDark: 'dark:bg-cyan-950',
  },
  {
    days: 365,
    label: 'LENDÁRIO',
    color: '#fbbf24',
    icon: Trophy,
    bgLight: 'bg-amber-100',
    bgDark: 'dark:bg-amber-950',
  },
  {
    days: 180,
    label: 'SUPERNOVA',
    color: '#3b82f6',
    icon: Zap,
    bgLight: 'bg-blue-100',
    bgDark: 'dark:bg-blue-950',
  },
  {
    days: 90,
    label: 'INFERNAL',
    color: '#8b5cf6',
    icon: Flame,
    bgLight: 'bg-violet-100',
    bgDark: 'dark:bg-violet-950',
  },
  {
    days: 30,
    label: 'INCÊNDIO',
    color: '#ef4444',
    icon: Flame,
    bgLight: 'bg-red-100',
    bgDark: 'dark:bg-red-950',
  },
  {
    days: 7,
    label: 'EM CHAMAS',
    color: '#f97316',
    icon: Flame,
    bgLight: 'bg-orange-100',
    bgDark: 'dark:bg-orange-950',
  },
  {
    days: 0,
    label: 'FAGULHA',
    color: '#a1a1aa',
    icon: Flame,
    bgLight: 'bg-gray-100',
    bgDark: 'dark:bg-gray-800',
  },
];

export const SIMULATION_OPTIONS = [
  {
    days: 7,
    label: '1 Semana',
    color: 'text-orange-500',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/10',
  },
  {
    days: 30,
    label: '1 Mês',
    color: 'text-red-500',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
  },
  {
    days: 90,
    label: '3 Meses',
    color: 'text-purple-500',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
  },
  {
    days: 180,
    label: '6 Meses',
    color: 'text-blue-500',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
  },
  {
    days: 365,
    label: '1 Ano',
    color: 'text-yellow-600',
    border: 'border-yellow-600/20',
    bg: 'bg-yellow-600/10',
  },
  {
    days: 730,
    label: '2 Anos',
    color: 'text-cyan-500',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10',
  },
  {
    days: 1095,
    label: '3 Anos',
    color: 'text-pink-500',
    border: 'border-pink-500/20',
    bg: 'bg-pink-500/10',
  },
  {
    days: 1825,
    label: '5 Anos',
    color: 'text-emerald-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
  },
];
