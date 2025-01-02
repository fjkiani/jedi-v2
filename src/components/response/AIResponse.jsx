import IndustryResponse from './IndustryResponse';
import TechnologyResponse from './TechnologyResponse';

const AIResponse = ({ response, variant = 'default' }) => {
  if (!response) return null;

  if (variant === 'simple') {
    return <IndustryResponse response={response} />;
  }

  return <TechnologyResponse response={response} />;
};

export default AIResponse; 