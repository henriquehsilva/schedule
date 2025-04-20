import React, { useEffect, useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { formatTime, getEventsForDay, isEventCurrent, getTimeRemaining } from '../utils/dateUtils';
import { Clock, ArrowRight } from 'lucide-react';

interface CurrentEventProps {
  selectedDate: Date;
}

const CurrentEvent: React.FC<CurrentEventProps> = ({ selectedDate }) => {
  const { state } = useEvents();
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateCurrentEvent = () => {
      const todayEvents = getEventsForDay(state.events || [], new Date());

      const current = todayEvents.find(event => isEventCurrent(event) && !event.completed);
      setCurrentEvent(current || null);

      if (current) {
        setTimeRemaining(getTimeRemaining(current));
      }

      const now = new Date();
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      const upcoming = todayEvents
        .filter(event => {
          if (!event.timeRange?.startTime) return false;
          const [startHour, startMinute] = event.timeRange.startTime.split(':').map(Number);
          return startHour * 60 + startMinute > currentTimeMinutes && !event.completed;
        })
        .sort((a, b) => {
          const [aH, aM] = a.timeRange.startTime.split(':').map(Number);
          const [bH, bM] = b.timeRange.startTime.split(':').map(Number);
          return (aH * 60 + aM) - (bH * 60 + bM);
        })[0];

      setNextEvent(upcoming || null);
    };

    updateCurrentEvent();
    const interval = setInterval(updateCurrentEvent, 60000);
    return () => clearInterval(interval);
  }, [state.events, selectedDate]);

  // Proteção extra: só renderiza se tudo estiver certo
  if ((!currentEvent && !nextEvent) || !Array.isArray(state.events)) return null;

  return (
    <div className="bg-dark-300 border-t border-dark-200 p-4 animate-slide-up">
      {currentEvent?.title && (
        <div className="mb-2">
          <div className="text-sm text-primary-400 mb-1 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>Evento atual</span>
            <span className="ml-auto text-gray-400">
              {timeRemaining > 0 ? `${timeRemaining} min restantes` : ''}
            </span>
          </div>
          <div 
            className="bg-dark-400 rounded-lg p-3 border-l-4"
            style={{ borderColor: currentEvent.category?.color || '#8B5CF6' }}
          >
            <h3 className="font-medium text-white">{currentEvent.title}</h3>
            <p className="text-sm text-gray-400">
              {formatTime(currentEvent.timeRange?.startTime)} - {formatTime(currentEvent.timeRange?.endTime)}
            </p>
          </div>
        </div>
      )}

      {nextEvent?.title && (
        <div>
          <div className="text-sm text-gray-400 mb-1 flex items-center">
            <ArrowRight className="w-3.5 h-3.5 mr-1" />
            <span>Próximo evento</span>
          </div>
          <div 
            className="bg-dark-400 rounded-lg p-3 border-l-4 opacity-80"
            style={{ borderColor: nextEvent.category?.color || '#666' }}
          >
            <h3 className="font-medium text-white">{nextEvent.title}</h3>
            <p className="text-sm text-gray-400">
              {formatTime(nextEvent.timeRange?.startTime)} - {formatTime(nextEvent.timeRange?.endTime)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentEvent;
