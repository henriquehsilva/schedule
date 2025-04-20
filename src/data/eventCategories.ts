import { EventCategory } from '../types/Event';

export const defaultEventCategories: EventCategory[] = [
  {
    id: 'workout',
    name: 'Workout',
    color: '#EF4444' // red-500
  },
  {
    id: 'meal',
    name: 'Meal',
    color: '#F59E0B' // amber-500
  },
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6' // blue-500
  },
  {
    id: 'study',
    name: 'Study',
    color: '#10B981' // emerald-500
  },
  {
    id: 'leisure',
    name: 'Leisure',
    color: '#8B5CF6' // violet-500
  },
  {
    id: 'uncategorized',
    name: 'Uncategorized',
    color: '#6B7280' // gray-500
  }
];