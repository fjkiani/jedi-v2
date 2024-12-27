import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

export const BreadcrumbNav = ({ industryTitle }) => (
  <div className="text-n-3 mb-6 flex items-center gap-2">
    <Link to="/industries" className="hover:text-n-1">Industries</Link>
    <Icon name="arrow-right" className="w-4 h-4" />
    <span className="text-n-1">{industryTitle}</span>
  </div>
); 