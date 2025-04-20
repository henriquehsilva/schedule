import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Event } from '../types/Event';
import { formatTime, isEventCurrent } from '../utils/dateUtils';
import { useEvents } from '../context/EventsContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const { dispatch } = useEvents();
  const isCurrent = isEventCurrent(event);
  const [showTextarea, setShowTextarea] = useState(false);
  const [observation, setObservation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_EVENT_COMPLETED', payload: event.id });
  };

  const handleSaveObservation = async () => {
    try {
      await addDoc(collection(db, 'observations'), {
        date: new Date().toISOString().split('T')[0],
        title: event.title,
        observation: observation.trim(),
        createdAt: serverTimestamp(),
      });

      setIsSaved(true);
      alert('Observação salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar observação:', error);
      alert('Erro ao salvar observação.');
    }
  };

  return (
    <div className="mb-3">
      <div
        className={`event-item flex items-center p-3 rounded-lg cursor-pointer transition-all ${
          event.completed
            ? 'bg-dark-300 opacity-60'
            : isCurrent
            ? 'ring-2 ring-primary-400 bg-primary-900/30'
            : 'bg-dark-400 hover:bg-dark-300'
        }`}
        onClick={() => setShowTextarea(prev => !prev)}
      >
        <div
          className="flex-shrink-0 w-3 h-full min-h-[3rem] rounded-l-md mr-3"
          style={{ backgroundColor: event.category.color }}
        />

        <div className="flex-grow">
          <h3 className="font-medium text-white">{event.title}</h3>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>
              {formatTime(event.timeRange.startTime)} - {formatTime(event.timeRange.endTime)}
            </span>
          </div>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            handleToggleComplete();
          }}
          className={`ml-2 p-2 rounded-full transition-all ${
            event.completed
              ? 'bg-primary-500/20 text-primary-400'
              : 'bg-dark-300 text-gray-400 hover:bg-dark-200'
          }`}
          aria-label={event.completed ? 'Marcar como incompleto' : 'Marcar como concluído'}
        >
          <CheckCircle2
            className={`w-5 h-5 ${event.completed ? 'fill-primary-500 text-white' : ''}`}
          />
        </button>
      </div>

      {showTextarea && (
        <div className="bg-dark-300 border border-dark-200 rounded-b-lg p-4 mt-1">
          <textarea
            value={observation}
            onChange={e => setObservation(e.target.value)}
            className="w-full p-2 rounded bg-dark-400 text-white border border-dark-100 resize-none"
            rows={3}
            placeholder="Escreva uma observação sobre esse evento..."
          />
          <button
            onClick={handleSaveObservation}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            {isSaved ? 'Editar observação' : 'Salvar observação'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventItem;
