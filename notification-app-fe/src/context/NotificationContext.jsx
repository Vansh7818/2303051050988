import React, { createContext, useContext, useState, useEffect } from 'react';
import logger from '../utils/logger';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem('read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      logger.error('Failed to parse read notifications from localStorage', err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
  }, [readIds]);

  const markAsRead = (id) => {
    setReadIds((prev) => {
      if (!prev.includes(id)) {
        logger.info(`Marked notification ${id} as read`);
        return [...prev, id];
      }
      return prev;
    });
  };

  const isRead = (id) => readIds.includes(id);

  return (
    <NotificationContext.Provider value={{ markAsRead, isRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationState = () => useContext(NotificationContext);
