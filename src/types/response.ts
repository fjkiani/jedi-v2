// Define types for our response structure
interface ResponseSection {
  type: string;
  icon?: string;
  title: string;
  content: ResponseContent[];
  visualType?: 'chart' | 'tree' | 'timeline' | 'metrics';
}

interface ResponseContent {
  type: 'text' | 'metric' | 'list' | 'breakthrough' | 'process';
  value: string | number;
  children?: ResponseContent[];
  metadata?: Record<string, any>;
} 