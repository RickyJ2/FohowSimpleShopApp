import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useGasApi } from '../hooks/useGasApi';
import { useConfirm } from '../context/ConfirmDialogState';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exitSystem, loading } = useGasApi();
  const { confirm } = useConfirm();

  const handleKeluar = async () => {
    const isConfirmed = await confirm({
      title: 'Konfirmasi Keluar',
      message: 'Apakah anda yakin ingin keluar?'
    });

    if (isConfirmed) {
      try {
        await exitSystem();
      } catch {
        // Ignore exit errors
      }
      navigate('/');
    }
  };

  // Hide the entire Header on the entry page
  const isEntryPage = location.pathname === '/';
  if (isEntryPage) return null;

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', mb: 2 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          {import.meta.env.VITE_APP_NAME || 'Kelola Toko'}
        </Typography>
        
          <Button 
            color="inherit" 
            onClick={handleKeluar}
            disabled={loading}
            startIcon={<ExitToAppIcon />}
            sx={{ 
              height: '64px', // Match standard toolbar height
              borderRadius: 0,
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            KELUAR
          </Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
