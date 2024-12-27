import { DeploymentView } from '@/components/diagrams/views/DeploymentView';

export const DeploymentTab = ({ diagram }) => (
  <div className="bg-n-8 rounded-2xl border border-n-6 overflow-hidden">
    <DeploymentView diagram={diagram} />
  </div>
); 