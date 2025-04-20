import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Event } from '../types/Event';
import { formatTime, isEventCurrent } from '../utils/dateUtils';
import { useEvents } from '../context/EventsContext';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const { dispatch } = useEvents();
  const isCurrent = isEventCurrent(event);
  const [showTextarea, setShowTextarea] = useState(false);
  const [observation, setObservation] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [observationId, setObservationId] = useState<string | null>(null);
  const [localCompleted, setLocalCompleted] = useState(event.completed);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchObservation = async () => {
      try {
        const q = query(
          collection(db, 'observations'),
          where('date', '==', today),
          where('title', '==', event.title)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setObservation(docData.data().observation || '');
          setLocalCompleted(docData.data().completed || false);
          setIsSaved(true);
          setObservationId(docData.id);
        }
      } catch (error) {
        console.error('Erro ao buscar observação:', error);
      }
    };

    fetchObservation();
  }, [event.title, today]);

  const handleToggleComplete = async () => {
    const updated = !localCompleted;
    setLocalCompleted(updated);
    dispatch({ type: 'TOGGLE_EVENT_COMPLETED', payload: event.id });

    try {
      if (observationId) {
        const ref = doc(db, 'observations', observationId);
        await updateDoc(ref, { completed: updated });
      } else {
        const newDoc = await addDoc(collection(db, 'observations'), {
          date: today,
          title: event.title,
          observation: '',
          completed: updated,
          createdAt: serverTimestamp()
        });
        setObservationId(newDoc.id);
      }
    } catch (error) {
      console.error('Erro ao atualizar status de conclusão:', error);
    }
  };

  const handleSaveObservation = async () => {
    try {
      if (observationId) {
        const ref = doc(db, 'observations', observationId);
        await updateDoc(ref, { observation: observation.trim() });
      } else {
        const newDoc = await addDoc(collection(db, 'observations'), {
          date: today,
          title: event.title,
          observation: observation.trim(),
          completed: localCompleted,
          createdAt: serverTimestamp()
        });
        setObservationId(newDoc.id);
      }

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
          localCompleted
            ? 'bg-dark-300 opacity-60'
            : isCurrent
            ? 'ring-2 ring-primary-400 bg-primary-900/30'
            : 'bg-dark-400 hover:bg-dark-300'
        }`}
        onClick={() => setShowTextarea(prev => !prev)}
      >
        <div
          className="flex-shrink-0 w-3 h-full min-h-[3rem] rounded-l-md mr-3"
          style={{ backgroundColor: event.category.color || '#8B5CF6' }}
        />

        <div className="flex-grow">
          <h3 className={`font-medium text-white ${localCompleted ? 'line-through text-gray-500' : ''}`}>
            {event.title}
          </h3>
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
            localCompleted
              ? 'bg-primary-500/20 text-primary-400'
              : 'bg-dark-300 text-gray-400 hover:bg-dark-200'
          }`}
          aria-label={localCompleted ? 'Marcar como incompleto' : 'Marcar como concluído'}
        >
          <CheckCircle2
            className={`w-5 h-5 ${localCompleted ? 'fill-primary-500 text-white' : ''}`}
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
