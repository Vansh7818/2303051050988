import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useNotificationState } from '../context/NotificationContext';
import { useInView } from 'react-intersection-observer';

const typeColors = {
  Event: 'info',
  Result: 'warning',
  Placement: 'success',
};

const NotificationCard = ({ notification }) => {
  const { id, title, message, notificationType, createdAt } = notification;
  const { isRead, markAsRead } = useNotificationState();
  const read = isRead(id);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !read) {
      markAsRead(id);
    }
  }, [inView, read, id, markAsRead]);

  return (
    <Card 
      ref={ref}
      sx={{ 
        mb: 2, 
        borderLeft: 6, 
        borderColor: read ? 'grey.300' : `${typeColors[notificationType] || 'primary'}.main`,
        bgcolor: read ? 'background.paper' : 'action.hover',
        transition: 'background-color 0.3s ease'
      }}
      elevation={read ? 1 : 3}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" sx={{ fontWeight: read ? 'normal' : 'bold' }}>
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {!read && <Chip label="New" color="error" size="small" />}
            <Chip 
              label={notificationType} 
              color={typeColors[notificationType] || 'default'} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
          {new Date(createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
