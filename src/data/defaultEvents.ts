import { Event } from '../types/Event';
import { v4 as uuidv4 } from '../utils/uuid';

export const defaultEvents: Event[] = [
  // Monday, Wednesday, Friday
  {
    id: uuidv4(),
    title: 'Meditação',
    timeRange: { startTime: '07:00', endTime: '08:00' },
    completed: false,
    daysOfWeek: ['monday', 'wednesday', 'friday'],
    category: { id: 'study', name: 'Study', color: '#10B981' }
  },
  {
    id: uuidv4(),
    title: 'Café da Manhã',
    timeRange: { startTime: '08:00', endTime: '09:00' },
    completed: false,
    daysOfWeek: ['monday', 'wednesday', 'friday'],
    category: { id: 'meal', name: 'Meal', color: '#F59E0B' }
  },
  {
    id: uuidv4(),
    title: 'Cross Pilates',
    timeRange: { startTime: '09:00', endTime: '10:00' },
    completed: false,
    daysOfWeek: ['monday', 'wednesday', 'friday'],
    category: { id: 'workout', name: 'Workout', color: '#EF4444' }
  },

  // Tuesday, Thursday
  {
    id: uuidv4(),
    title: 'Academia',
    timeRange: { startTime: '07:00', endTime: '09:00' },
    completed: false,
    daysOfWeek: ['tuesday', 'thursday'],
    category: { id: 'workout', name: 'Workout', color: '#EF4444' }
  },
  {
    id: uuidv4(),
    title: 'Café da Manhã',
    timeRange: { startTime: '09:00', endTime: '10:00' },
    completed: false,
    daysOfWeek: ['tuesday', 'thursday'],
    category: { id: 'meal', name: 'Meal', color: '#F59E0B' }
  },

  // Monday to Friday
  {
    id: uuidv4(),
    title: 'Trabalho (Manhã)',
    timeRange: { startTime: '10:00', endTime: '12:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'work', name: 'Work', color: '#3B82F6' }
  },
  {
    id: uuidv4(),
    title: 'Almoço',
    timeRange: { startTime: '12:00', endTime: '13:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'meal', name: 'Meal', color: '#F59E0B' }
  },
  {
    id: uuidv4(),
    title: 'Trabalho (Tarde)',
    timeRange: { startTime: '13:00', endTime: '19:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'work', name: 'Work', color: '#3B82F6' }
  },
  {
    id: uuidv4(),
    title: 'Jantar',
    timeRange: { startTime: '19:00', endTime: '20:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'meal', name: 'Meal', color: '#F59E0B' }
  },
  {
    id: uuidv4(),
    title: 'English Class',
    timeRange: { startTime: '20:00', endTime: '21:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'study', name: 'Study', color: '#10B981' }
  },
  {
    id: uuidv4(),
    title: 'Estudo Software Engineering',
    timeRange: { startTime: '21:00', endTime: '22:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'study', name: 'Study', color: '#10B981' }
  },
  {
    id: uuidv4(),
    title: 'Tempo de Leitura',
    timeRange: { startTime: '22:00', endTime: '23:00' },
    completed: false,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    category: { id: 'leisure', name: 'Leisure', color: '#8B5CF6' }
  },

  // Saturday
  {
    id: uuidv4(),
    title: 'Café da Manhã',
    timeRange: { startTime: '07:00', endTime: '08:00' },
    completed: false,
    daysOfWeek: ['saturday'],
    category: { id: 'meal', name: 'Meal', color: '#F59E0B' }
  },
  {
    id: uuidv4(),
    title: 'Academia',
    timeRange: { startTime: '08:00', endTime: '10:00' },
    completed: false,
    daysOfWeek: ['saturday'],
    category: { id: 'workout', name: 'Workout', color: '#EF4444' }
  }
];