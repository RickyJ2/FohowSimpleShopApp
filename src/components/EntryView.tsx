import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Alert, Card, CardContent } from '@mui/material';
import { useGasApi } from '../hooks/useGasApi';

const EntryView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkStatus, enterSystem, forceLogin, loading, error, deviceId } = useGasApi();
  const [status, setStatus] = useState<string>('UNKNOWN');
  const [localError, setLocalError] = useState<string | null>(location.state?.message || null);

  const fetchStatus = useCallback(async () => {
    const res = await checkStatus();
    if (res) {
      setStatus(res.status);
    } else {
      setStatus('UNKNOWN');
    }
  }, [checkStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatus();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchStatus]);

  const handleMasuk = async () => {
    setLocalError(null);
    const res = await enterSystem();
    if (res && res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message || 'Gagal masuk ke sistem.');
      fetchStatus();
    }
  };

  const handleForceLogin = async () => {
    setLocalError(null);
    const res = await forceLogin();
    if (res && res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message || 'Gagal masuk paksa.');
      fetchStatus();
    }
  };

  const isBusyByOther = status !== 'FREE' && status !== 'UNKNOWN' && status !== deviceId;
  const isMine = status !== 'FREE' && status !== 'UNKNOWN' && status === deviceId;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      {/* Top Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" color="textSecondary" sx={{fontWeight: 'bold'}}>
          {import.meta.env.VITE_APP_SUBTITLE}
        </Typography>
        <Typography variant="h4" sx={{fontWeight: 'bold', color: 'primary'}}>
          {import.meta.env.VITE_APP_NAME}
        </Typography>
      </Box>

      {/* Middle Section: Card */}
      <Card sx={{ width: '100%', maxWidth: 450, elevation: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {localError && <Alert severity="warning" sx={{ mb: 3 }}>{localError}</Alert>}

          <Typography variant="h6" color="textSecondary" gutterBottom>
            Status Sistem:
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              color={status === 'FREE' || isMine ? 'primary' : 'error'}
              sx={{fontWeight: 'bold'}}
            >
              {status === 'FREE' ? 'TERSEDIA' : isMine ? 'ANDA SUDAH MASUK' : 'SEDANG DIGUNAKAN'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isBusyByOther ? (
              <Button
                variant="contained"
                color="warning"
                size="large"
                fullWidth
                onClick={handleForceLogin}
                disabled={loading}
                sx={{ 
                  py: 2, 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  bgcolor: '#ed6c02',
                  '&:hover': { bgcolor: '#e65100' }
                }}
              >
                PAKSA MASUK
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={(status !== 'FREE' && !isMine) || loading}
                onClick={handleMasuk}
                sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                MASUK APLIKASI
              </Button>
            )}

            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              fullWidth
              onClick={fetchStatus} 
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              Refresh Status
            </Button>
          </Box>

          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3, lineHeight: 1.4 }}>
            {isBusyByOther 
              ? 'Tekan tombol Paksa Masuk untuk memidahkan akses ke perangkat ini'
              : 'Tekan tombol masuk untuk masuk ke dalam aplikasi'
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'monospace' }}>
          Device ID: {deviceId}
        </Typography>
      </Box>
    </Box>
  );
};

export default EntryView;
