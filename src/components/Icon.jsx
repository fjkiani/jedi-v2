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
  CommandLineIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  chart: ChartBarIcon,
  tool: WrenchIcon,
  lightbulb: LightBulbIcon,
  check: CheckIcon,
  server: ServerIcon,
  cloud: CloudIcon,
  shield: ShieldCheckIcon,
  code: CodeBracketIcon,
  cpu: CpuChipIcon,
  rocket: RocketLaunchIcon,
  database: CircleStackIcon,
  huggingface: BeakerIcon,
  langchain: CommandLineIcon
};

export const Icon = ({ name, className }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    // console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default Icon;
