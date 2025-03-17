import { Box, Typography, Paper } from '@mui/material';
import { customColors } from '../App';

export const TeamInfo: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Informações da Equipe
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          Bem-vindo à página de informações da equipe Gold Black Dragons.
        </Typography>
        {/* Adicione mais conteúdo conforme necessário */}
      </Paper>
    </Box>
  );
}; 