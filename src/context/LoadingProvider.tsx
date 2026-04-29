import React, { useState, type ReactNode } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { LoadingContext } from './LoadingState';

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 101 }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} />
      </Backdrop>
    </LoadingContext.Provider>
  );
};
