import { Event } from '../types/Event';

const NOTIFICATION_PERMISSION_KEY = 'notification-permission-asked';

export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const wasAsked = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
  
  if (Notification.permission !== 'denied' && !wasAsked) {
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
};

export const scheduleNotification = (event: Event, minutesBefore = 5) => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const [hours, minutes] = event.timeRange.startTime.split(':').map(Number);
  
  const eventTime = new Date();
  eventTime.setHours(hours, minutes, 0, 0);
  
  // Subtract the notification time (default 5 minutes before)
  const notificationTime = new Date(eventTime.getTime() - (minutesBefore * 60 * 1000));
  
  // Only schedule if it's in the future
  if (notificationTime > now) {
    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    
    setTimeout(() => {
      const notification = new Notification(`${event.title} começa em ${minutesBefore} minutos`, {
        body: `De ${event.timeRange.startTime} até ${event.timeRange.endTime}`,
        icon: '/pwa-192x192.png'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }, timeUntilNotification);
  }
};

export const scheduleNotificationsForEvents = (events: Event[]) => {
  if (Notification.permission !== 'granted') {
    return;
  }
  
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }) as any;
  
  const todayEvents = events.filter(event => 
    event.daysOfWeek.includes(dayOfWeek) && !event.completed
  );
  
  todayEvents.forEach(event => {
    scheduleNotification(event);
  });
};