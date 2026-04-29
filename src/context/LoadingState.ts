import { createContext, useContext } from 'react';

interface LoadingContextType {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
