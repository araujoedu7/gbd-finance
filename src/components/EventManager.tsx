import React, { useState } from 'react';
import { Event, Notice } from '../types';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface EventManagerProps {
  events: Event[];
  notices: Notice[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onEditNotice: (notice: Notice) => void;
  onDeleteNotice: (noticeId: number) => void;
}

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EventManager({
  events,
  notices,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onAddNotice,
  onEditNotice,
  onDeleteNotice,
}: EventManagerProps) {
  const [tabValue, setTabValue] = useState(0);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openNoticeDialog, setOpenNoticeDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting' as Event['type'],
    location: '',
  });
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'medium' as Notice['priority'],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenEventDialog = (event?: Event) => {
    if (event) {
      setSelectedEvent(event);
      setEventForm({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        type: event.type,
        location: event.location,
      });
    } else {
      setSelectedEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'meeting',
        location: '',
      });
    }
    setOpenEventDialog(true);
  };

  const handleOpenNoticeDialog = (notice?: Notice) => {
    if (notice) {
      setSelectedNotice(notice);
      setNoticeForm({
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
      });
    } else {
      setSelectedNotice(null);
      setNoticeForm({
        title: '',
        content: '',
        priority: 'medium',
      });
    }
    setOpenNoticeDialog(true);
  };

  const handleSubmitEvent = () => {
    if (selectedEvent) {
      onEditEvent({ ...eventForm, id: selectedEvent.id });
    } else {
      onAddEvent(eventForm);
    }
    setOpenEventDialog(false);
  };

  const handleSubmitNotice = () => {
    if (selectedNotice) {
      onEditNotice({ ...noticeForm, id: selectedNotice.id });
    } else {
      onAddNotice(noticeForm);
    }
    setOpenNoticeDialog(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Eventos" />
          <Tab label="Avisos" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenEventDialog()}
            >
              Novo Evento
            </Button>
          </Box>

          <List>
            {events.map((event) => (
              <ListItem
                key={event.id}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => handleOpenEventDialog(event)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteEvent(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={event.title}
                  secondary={`${event.date} às ${event.time} - ${event.location}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenNoticeDialog()}
            >
              Novo Aviso
            </Button>
          </Box>

          <List>
            {notices.map((notice) => (
              <ListItem
                key={notice.id}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => handleOpenNoticeDialog(notice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteNotice(notice.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={notice.title}
                  secondary={`Prioridade: ${notice.priority}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Box>

      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Data"
            type="date"
            fullWidth
            value={eventForm.date}
            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Horário"
            type="time"
            fullWidth
            value={eventForm.time}
            onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={eventForm.type}
              onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as Event['type'] })}
            >
              <MenuItem value="meeting">Reunião</MenuItem>
              <MenuItem value="competition">Competição</MenuItem>
              <MenuItem value="training">Treino</MenuItem>
              <MenuItem value="other">Outro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Local"
            fullWidth
            value={eventForm.location}
            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmitEvent} variant="contained">
            {selectedEvent ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openNoticeDialog} onClose={() => setOpenNoticeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedNotice ? 'Editar Aviso' : 'Novo Aviso'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={noticeForm.title}
            onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Conteúdo"
            fullWidth
            multiline
            rows={4}
            value={noticeForm.content}
            onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={noticeForm.priority}
              onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as Notice['priority'] })}
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoticeDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmitNotice} variant="contained">
            {selectedNotice ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 