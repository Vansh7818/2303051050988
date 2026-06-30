import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Pagination } from '@mui/material';
import { fetchNotifications } from '../api/notificationApi';
import NotificationCard from '../components/NotificationCard';
import logger from '../utils/logger';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        logger.info(`Fetching notifications for page ${page}`);
        const response = await fetchNotifications({ page, limit });
        setNotifications(response.data);
        setTotalPages(Math.ceil(response.meta.total / limit));
        setError(null);
      } catch (err) {
        logger.error('Failed to load notifications', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>

      {error && (
        <Typography color="error" variant="body1" mb={2}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Typography variant="body1">No notifications found.</Typography>
          ) : (
            notifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))
          )}

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default AllNotifications;
