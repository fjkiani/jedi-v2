import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import SolutionsOverview from '@/pages/solutions/SolutionsOverview';
// Import both SolutionPage components with different names
import GeneralSolutionPage from '@/pages/solutions/SolutionPage';
import IndustrySolutionPage from '@/features/industries/pages/SolutionPage';
import IndustryPage from '@/features/industries/pages/IndustryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'solutions',
        children: [
          {
            index: true,
            element: <SolutionsOverview />
          },
          {
            path: ':slug',
            element: <GeneralSolutionPage />  // General solutions page
          }
        ]
      },
      {
        path: 'industries/:industryId',
        children: [
          {
            index: true,
            element: <IndustryPage />
          },
          {
            path: ':solutionId',
            element: <IndustrySolutionPage />  // Industry-specific solutions page
          }
        ]
      }
    ]
  }
]);