import React from 'react';
import {
  ChartBarIcon,
  WrenchIcon,
  LightBulbIcon,
  CheckIcon,
  ServerIcon,
  CloudIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  BeakerIcon,
  CommandLineIcon,
  HeartIcon,
  FilmIcon,
  BoltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  CheckBadgeIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ViewfinderCircleIcon,
  CogIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  PuzzlePieceIcon,
  Bars3Icon,
  AcademicCapIcon,
  TrophyIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  chart: ChartBarIcon,
  'bar-chart-2': ChartBarIcon,
  tool: WrenchIcon,
  lightbulb: LightBulbIcon,
  check: CheckIcon,
  'check-circle': CheckCircleIcon,
  'check-square': CheckBadgeIcon,
  server: ServerIcon,
  cloud: CloudIcon,
  shield: ShieldCheckIcon,
  'shield-check': ShieldCheckIcon,
  code: CodeBracketIcon,
  cpu: CpuChipIcon,
  chip: CpuChipIcon,
  rocket: RocketLaunchIcon,
  database: CircleStackIcon,
  huggingface: BeakerIcon,
  langchain: CommandLineIcon,
  heart: HeartIcon,
  film: FilmIcon,
  zap: BoltIcon,
  'arrow-right': ArrowRightIcon,
  grid: Squares2X2Icon,
  chevron: ChevronRightIcon,
  book: BookOpenIcon,
  'message-circle': ChatBubbleLeftRightIcon,
  target: ViewfinderCircleIcon,
  settings: CogIcon,
  cog: CogIcon,
  'shopping-cart': ShoppingCartIcon,
  'dollar-sign': BanknotesIcon,
  activity: ArrowTrendingUpIcon,
  'trending-up': ArrowTrendingUpIcon,
  puzzle: PuzzlePieceIcon,
  layout: Bars3Icon,
  'git-branch': Bars3Icon,
  award: TrophyIcon,
  info: InformationCircleIcon,
  'alert-triangle': ExclamationTriangleIcon,
  clock: ClockIcon,
  'x-circle': XCircleIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon
};

export const Icon = ({ name, className }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default Icon;
