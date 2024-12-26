import { Route } from 'react-router-dom';
import SolutionPage from '../pages/SolutionPage';

export const industryRoutes = [
  {
    path: ':industryId/:solutionId',
    element: <SolutionPage />
  }
]; 