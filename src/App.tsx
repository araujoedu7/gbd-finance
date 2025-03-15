import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Tabs, Tab, Paper } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';
import { StudentList } from './components/StudentList';
import { AddStudent } from './components/AddStudent';
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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Gold Black Dragons
      </Typography>
      <Typography variant="body1" paragraph>
        Sistema de gestão da equipe Gold Black Dragons. Aqui você encontra:
      </Typography>
      <ul>
        <Typography component="li" variant="body1">Controle financeiro dos alunos</Typography>
        <Typography component="li" variant="body1">Informativos importantes da equipe</Typography>
      </ul>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
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
          </Tabs>
        </AppBar>

        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <TabPanel value={currentTab} index={0}>
            <Home />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
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
        </Container>

        <Box component="footer" sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
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
