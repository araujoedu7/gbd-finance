import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Tabs, Tab, Paper, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Event as EventIcon } from '@mui/icons-material';
import { StudentList } from './components/StudentList';
import { AddStudent } from './components/AddStudent';
import TeamNotices from './components/TeamNotices';
import api from './services/api';
import { Student, Payment } from './types';

// Definindo as cores personalizadas
export const customColors = {
  gold: '#D4AF37',
  goldLight: '#FFE5A9',
  black: '#000000',
  blackLight: '#222222',
  white: '#FFFFFF',
  grayLight: '#F5F5F5'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: customColors.gold,
      light: customColors.goldLight,
      dark: customColors.black,
      contrastText: customColors.white,
    },
    secondary: {
      main: customColors.black,
      light: customColors.blackLight,
      dark: customColors.black,
      contrastText: customColors.white,
    },
    background: {
      default: customColors.white,
      paper: customColors.white,
    },
    text: {
      primary: customColors.black,
      secondary: customColors.blackLight,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: customColors.black,
          color: customColors.white,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: customColors.gold,
          color: customColors.black,
          '&:hover': {
            backgroundColor: customColors.goldLight,
          },
        },
        outlined: {
          borderColor: customColors.gold,
          color: customColors.gold,
          '&:hover': {
            borderColor: customColors.goldLight,
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: customColors.white,
          '&.Mui-selected': {
            color: customColors.gold,
          },
        },
      }
    },
  },
}, ptBR);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/team-photo.png',
    '/images/team-photo2.png',
    '/images/team-photo3.png'
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Efeito para trocar as imagens automaticamente a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(handleNextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Bem-vindo ao Gold Black Dragons
      </Typography>
      
      <Paper elevation={3} sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        bgcolor: customColors.white,
        borderRadius: 2,
        height: { xs: 'auto', md: '600px' },
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: '50%' },
          height: { xs: '400px', md: '600px' },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: customColors.gold,
          flexShrink: 0,
          flexGrow: 0,
        }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={`http://localhost:5173${images[currentImageIndex]}`}
              alt={`Gold Black Dragons Team ${currentImageIndex + 1}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                backgroundColor: customColors.gold,
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                console.error('Erro ao carregar a imagem:', target.src);
              }}
            />
          </Box>

          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: customColors.white,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: customColors.white,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)',
              }
            }}
          >
            <ArrowForwardIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 2
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentImageIndex ? customColors.gold : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    bgcolor: index === currentImageIndex ? customColors.gold : 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          width: { xs: '100%', md: '50%' },
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: { xs: 'auto', md: '100%' },
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: customColors.black, mb: 2 }}>
            Sobre a Equipe
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: customColors.blackLight, mb: 2 }}>
            A Gold Black Dragons é uma equipe dedicada à excelência no desenvolvimento de atletas e formação de campeões. Nossa missão é proporcionar um ambiente de treinamento de alta qualidade, combinando disciplina, técnica e valores esportivos.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: customColors.blackLight, mb: 2 }}>
            Com uma metodologia única e professores altamente qualificados, buscamos não apenas formar atletas, mas também cidadãos comprometidos com o esporte e a sociedade.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: customColors.gold }}>
              Nossos Diferenciais:
            </Typography>
            <ul style={{ color: customColors.blackLight, paddingLeft: '1.5rem' }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Treinamento personalizado</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Infraestrutura completa</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Equipe técnica especializada</Typography>
              <Typography component="li" variant="body1">Acompanhamento individual</Typography>
            </ul>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    showOnlyUnpaid: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleAddStudent = async (student: Omit<Student, 'id' | 'payments' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newStudent = await api.addStudent(student);
      setStudents([...students, newStudent]);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Erro ao adicionar aluno. Tente novamente.');
    }
  };

  const handlePaymentStatusChange = async (studentId: number, payment: Omit<Payment, 'id' | 'StudentId'>) => {
    try {
      const updatedStudent = await api.updatePayment(studentId, payment);
      setStudents(students.map(student =>
        student.id === studentId ? updatedStudent : student
      ));
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Erro ao atualizar pagamento. Tente novamente.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <AppBar position="static" sx={{ width: '100%' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gold Black Dragons
            </Typography>
          </Toolbar>
          <Tabs 
            value={currentTab} 
            onChange={(_, newValue) => setCurrentTab(newValue)}
            centered
            sx={{ bgcolor: customColors.blackLight }}
          >
            <Tab 
              icon={<HomeIcon />} 
              label="Home"
            />
            <Tab 
              icon={<AttachMoneyIcon />} 
              label="Financeiro"
            />
            <Tab 
              icon={<EventIcon />} 
              label="Avisos"
            />
          </Tabs>
        </AppBar>

        <Container 
          component="main" 
          sx={{ 
            mt: 4, 
            mb: 4, 
            flex: 1, 
            maxWidth: 'none !important',
            width: '100%',
            px: { xs: 1, sm: 2 }
          }}
        >
          <TabPanel value={currentTab} index={0}>
            <Home />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <AddStudent onAddStudent={handleAddStudent} />
              <StudentList
                students={students}
                filterOptions={filterOptions}
                onPaymentStatusChange={handlePaymentStatusChange}
                onFilterChange={setFilterOptions}
                setStudents={setStudents}
              />
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <TeamNotices />
          </TabPanel>
        </Container>

        <Box component="footer" sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          width: '100%',
          backgroundColor: customColors.black,
          color: customColors.white
        }}>
          <Container maxWidth="sm">
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} Gold Black Dragons. Todos os direitos reservados.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
