import { DayOfWeek, Event } from '../types/Event';

export const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

export const formatDateHeader = (date: Date): string => {
  try {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return date.toDateString(); // fallback simples
  }
};


export const getEventsForDay = (events: Event[], date: Date): Event[] => {
  const dayOfWeek = getDayOfWeek(date);
  
  return events
    .filter(event => event.daysOfWeek.includes(dayOfWeek))
    .sort((a, b) => {
      return a.timeRange.startTime.localeCompare(b.timeRange.startTime);
    });
};

export const isEventCurrent = (event: Event): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [startHour, startMinute] = event.timeRange.startTime.split(':').map(Number);
  const [endHour, endMinute] = event.timeRange.endTime.split(':').map(Number);
  
  const currentTime = currentHour * 60 + currentMinute;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime < endTime;
};

export const getTimeRemaining = (event: Event): number => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [endHour, endMinute] = event.timeRange.endTime.split(':').map(Number);
  
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  
  return endTimeMinutes - currentTimeMinutes;
};