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
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  chart: ChartBarIcon,
  tool: WrenchIcon,
  lightbulb: LightBulbIcon,
  check: CheckIcon,
  'check-circle': CheckCircleIcon,
  'check-square': CheckBadgeIcon,
  server: ServerIcon,
  cloud: CloudIcon,
  shield: ShieldCheckIcon,
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
  chevron: ChevronRightIcon
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
