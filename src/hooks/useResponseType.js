import { useMemo } from 'react';

export const useResponseType = (techId) => {
  return useMemo(() => {
    return techId.includes('crispr') ? 'CRISPR' : 'DEFAULT';
  }, [techId]);
}; 