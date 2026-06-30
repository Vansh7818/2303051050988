import axios from 'axios';
import logger from '../utils/logger';

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: 'http://4.224.186.213/evaluation-service',
  timeout: 5000,
});

// Integrate logging middleware
logger.attachAxiosInterceptor(apiClient);

// Mock data generator for fallback
const generateMockNotifications = (limit = 20, page = 1, type = null) => {
  const types = ['Event', 'Result', 'Placement'];
  const notifications = [];
  
  // Total of 50 mock notifications
  for (let i = 1; i <= 50; i++) {
    const notifType = types[i % 3];
    notifications.push({
      id: `mock-notif-${i}`,
      title: `Sample ${notifType} Notification ${i}`,
      message: `This is a mock notification for ${notifType}. ID: ${i}`,
      notificationType: notifType,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    });
  }

  // Filter
  let filtered = notifications;
  if (type) {
    filtered = filtered.filter(n => n.notificationType === type);
  }

  // Paginate
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated,
    meta: {
      total: filtered.length,
      page,
      limit
    }
  };
};

export const fetchNotifications = async ({ page = 1, limit = 20, notificationType = '' }) => {
  try {
    const params = { page, limit };
    if (notificationType) {
      params.notification_type = notificationType;
    }

    // Since it's a protected route, we'd normally attach a token:
    // const token = localStorage.getItem('token');
    // const headers = { Authorization: `Bearer ${token}` };

    const response = await apiClient.get('/notifications', { params });
    return response.data;
  } catch (error) {
    logger.warn('Failed to fetch from real API, falling back to mock data.', { error: error.message });
    // Fallback to mock data for demonstration
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateMockNotifications(limit, page, notificationType));
      }, 500); // simulate network delay
    });
  }
};
