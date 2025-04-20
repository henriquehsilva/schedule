import React from 'react';
import { useEvents } from '../context/EventsContext';
import { getEventsForDay } from '../utils/dateUtils';
import EventItem from './EventItem';
import { Dumbbell, Coffee, BookOpen, Briefcase, GraduationCap } from 'lucide-react';

interface DailyScheduleProps {
  selectedDate: Date;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ selectedDate }) => {
  const { state } = useEvents();
  const events = getEventsForDay(state.events, selectedDate);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'workout':
        return <Dumbbell className="w-5 h-5" />;
      case 'meal':
        return <Coffee className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      case 'study':
        return <GraduationCap className="w-5 h-5" />;
      case 'leisure':
        return <BookOpen className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Group events by category
  const eventsByCategory = events.reduce((acc: Record<string, typeof events>, event) => {
    const categoryId = event.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(event);
    return acc;
  }, {});

  // Get unique categories that have events today
  const categories = Object.keys(eventsByCategory).map(categoryId => {
    const category = state.categories.find(c => c.id === categoryId);
    return category || { id: categoryId, name: 'Unknown', color: '#6B7280' };
  });

  if (events.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-dark-400 rounded-lg p-6 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-primary-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-2">Sem compromissos</h3>
          <p className="text-gray-400">
            Não há eventos programados para este dia. Aproveite seu tempo livre!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-fade-in">
      <div className="flex flex-wrap mb-4 -mx-1">
        {categories.map(category => (
          <div 
            key={category.id}
            className="px-1 py-1"
          >
            <div 
              className="flex items-center px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: `${category.color}30`,
                color: category.color
              }}
            >
              <span className="mr-1">{getCategoryIcon(category.id)}</span>
              {category.name}
            </div>
          </div>
        ))}
      </div>

      <div>
        {events.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default DailySchedule;