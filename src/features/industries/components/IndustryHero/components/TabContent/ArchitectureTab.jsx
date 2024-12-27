import { DiagramView } from '@/components/diagrams/DiagramView';

export const ArchitectureTab = ({ diagram }) => (
  <div className="bg-n-8 rounded-2xl border border-n-6 overflow-hidden h-[600px]">
    <DiagramView diagram={diagram} />
  </div>
); 