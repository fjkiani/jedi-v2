import { Routes, Route } from 'react-router-dom';
import IndustryPage from '../pages/IndustryPage';
import IndustrySolutionPage from '../pages/SolutionPage';

const IndustryRoutes = () => (
  <Routes>
    <Route path=":industryId" element={<IndustryPage />} />
    <Route path=":industryId/solutions/:solutionId" element={<IndustrySolutionPage />} />
  </Routes>
);

export default IndustryRoutes; 