import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Section from '@/components/Section';
import Button from '@/components/Button';
import { useTheme } from '@/context/ThemeContext';
import SEO from '@/components/SEO';

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const pathSlug = (location?.pathname || '/404').replace(/^\//, '').replace(/\/$/, '') || 'home';
  const segs = pathSlug.split('/').filter(Boolean);
  // Use up to last two path segments so different 404 URLs share unique titles under 70 chars.
  // e.g. technology/openai-functions/use-case/ai-powered-research-assistant → "openai functions · ai powered research assistant"
  const primary = segs[segs.length - 1]?.replace(/-/g, ' ') || 'this page';
  const parent = segs.length > 1 ? segs[segs.length - 3]?.replace(/-/g, ' ') || segs[segs.length - 2]?.replace(/-/g, ' ') : null;
  const humanPath = parent && parent !== primary ? `${parent} · ${primary}` : primary;
  return (
    <Section className="min-h-[60vh] flex items-center justify-center">
      <SEO
        title={`404 · ${humanPath} | Jedi Labs`}
        description={`The page at ${location?.pathname || '/'} does not exist. Return to Jedi Labs — production AI deployment, training, and evaluation.`}
        path={location?.pathname || '/404'}
        robots="noindex, follow"
      />
      <div className="container text-center py-20">
        <h1 className={`text-6xl sm:text-8xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>404</h1>
        <p className={`body-1 mb-8 max-w-md mx-auto ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Page not found. The link may be broken or the page has been moved.
        </p>
        <Button href="/">Return Home</Button>
      </div>
    </Section>
  );
};

export default NotFound;
