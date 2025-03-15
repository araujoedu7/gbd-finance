import React from 'react';
import { Event } from '../types';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <List>
        {sortedEvents.map((event) => (
          <ListItem key={event.id} component={Paper} sx={{ mb: 2, p: 2 }}>
            <ListItemText
              primary={
                <Typography variant="h6">
                  {event.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(event.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} às {event.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Local: {event.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {event.type === 'meeting' ? 'Reunião' :
                          event.type === 'competition' ? 'Competição' :
                          event.type === 'training' ? 'Treino' : 'Outro'}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {event.description}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
        {events.length === 0 && (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body1" color="text.secondary" align="center">
                  Nenhum evento agendado
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
} 