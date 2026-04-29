import React, { useState, useCallback, type ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ConfirmDialogContext, type ConfirmOptions } from './ConfirmDialogState';

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const handleClose = useCallback((value: boolean) => {
    setOpen(false);
    if (resolver) {
      resolver.resolve(value);
    }
  }, [resolver]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onClose={() => handleClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#000' }}>
          {options.title || 'Konfirmasi'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.2rem', color: '#333' }}>
            {options.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1, pt: 0 }}>
          <Button onClick={() => handleClose(false)} color="inherit" fullWidth sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {options.cancelText || 'Batal'}
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" fullWidth variant="contained" autoFocus sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {options.confirmText || 'Ya'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
};
