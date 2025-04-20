import React, { useEffect, useState } from 'react';
import { formatDateHeader, getEventsForDay } from '../utils/dateUtils';
import { Calendar, Bell } from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { checkNotificationPermission } from '../utils/notificationUtils';

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onDateChange }) => {
  const { state } = useEvents();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const todayEvents = getEventsForDay(state.events, selectedDate);
    const completed = todayEvents.filter(e => e.completed).length;
    const total = todayEvents.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    setProgress(pct);
  }, [selectedDate, state.events]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleResetToToday = () => {
    onDateChange(new Date());
  };

  const handleRequestNotifications = async () => {
    await checkNotificationPermission();
  };

  return (
    <header className="sticky top-0 z-10 bg-dark-500/95 backdrop-blur-sm border-b border-dark-300 py-3 px-4 sm:px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-primary-400" />
          <h1 className="text-xl font-bold text-white">Productivity</h1>
        </div>

        <button 
          onClick={handleRequestNotifications}
          className="p-2 rounded-full hover:bg-dark-300 transition-colors"
          aria-label="Enable notifications"
        >
          <Bell className="w-5 h-5 text-primary-400" />
        </button>
      </div>

      <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-xl font-semibold capitalize">
          {formatDateHeader(selectedDate)}
        </h2>

        <div className="flex mt-2 sm:mt-0 space-x-2">
          <button 
            onClick={handlePreviousDay}
            className="px-3 py-1 bg-dark-400 hover:bg-dark-300 rounded-md text-sm transition-colors"
          >
            Anterior
          </button>
          
          <button 
            onClick={handleResetToToday}
            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded-md text-sm text-white transition-colors"
          >
            Hoje
          </button>
          
          <button 
            onClick={handleNextDay}
            className="px-3 py-1 bg-dark-400 hover:bg-dark-300 rounded-md text-sm transition-colors"
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-1">Progresso do dia: {progress}%</p>
        <div className="w-full bg-dark-300 rounded-full h-3">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
