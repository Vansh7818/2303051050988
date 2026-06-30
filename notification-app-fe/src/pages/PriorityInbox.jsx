import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { fetchNotifications } from '../api/notificationApi';
import NotificationCard from '../components/NotificationCard';
import logger from '../utils/logger';

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controls
  const [filterType, setFilterType] = useState('All');
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        logger.info('Fetching notifications for Priority Inbox');
        // Fetch a large batch since we need to sort and find top N across the dataset
        const response = await fetchNotifications({ page: 1, limit: 100 });
        setNotifications(response.data);
      } catch (error) {
        logger.error('Failed to load priority notifications', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const priorityNotifications = useMemo(() => {
    let filtered = notifications;
    
    // 1. Filter by type if selected
    if (filterType !== 'All') {
      filtered = filtered.filter(n => n.notificationType === filterType);
    }

    // 2. Sort by Priority (Weight first, then recency)
    const sorted = [...filtered].sort((a, b) => {
      const weightA = TYPE_WEIGHT[a.notificationType] || 0;
      const weightB = TYPE_WEIGHT[b.notificationType] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      
      // If weights are equal, sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 3. Limit to Top N
    return sorted.slice(0, topN);
  }, [notifications, filterType, topN]);

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Priority Inbox
      </Typography>

      <Box display="flex" gap={2} mb={4} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Notification Type</InputLabel>
          <Select
            value={filterType}
            label="Notification Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <TextField 
          label="Top N" 
          type="number" 
          size="small" 
          value={topN} 
          onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value) || 1))}
          sx={{ width: 100 }}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {priorityNotifications.length === 0 ? (
            <Typography variant="body1">No priority notifications found.</Typography>
          ) : (
            priorityNotifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default PriorityInbox;
