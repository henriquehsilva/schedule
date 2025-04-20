import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Event, EventAction, EventCategory, EventsState } from '../types/Event';
import { initializeAppData, saveEvents, saveCategories } from '../utils/storageUtils';
import { scheduleNotificationsForEvents } from '../utils/notificationUtils';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const initialState: EventsState = {
  events: [],
  categories: [],
  initialized: false
};

const EventsContext = createContext<{
  state: EventsState;
  dispatch: React.Dispatch<EventAction>;
}>({
  state: initialState,
  dispatch: () => null
});

const eventsReducer = (state: EventsState, action: EventAction): EventsState => {
  switch (action.type) {
    case 'INITIALIZE_EVENTS':
      return {
        ...state,
        events: action.payload,
        initialized: true
      };
    case 'INITIALIZE_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'TOGGLE_EVENT_COMPLETED':
      const updatedEvents = state.events.map(event =>
        event.id === action.payload
          ? { ...event, completed: !event.completed }
          : event
      );
      saveEvents(updatedEvents);
      return {
        ...state,
        events: updatedEvents,
      };
    case 'RESET_COMPLETED_EVENTS':
      const resetEvents = state.events.map(event => ({ ...event, completed: false }));
      saveEvents(resetEvents);
      return {
        ...state,
        events: resetEvents
      };
    case 'ADD_EVENT':
      const eventsWithNewEvent = [...state.events, action.payload];
      saveEvents(eventsWithNewEvent);
      return {
        ...state,
        events: eventsWithNewEvent
      };
    case 'DELETE_EVENT':
      const filteredEvents = state.events.filter(event => event.id !== action.payload);
      saveEvents(filteredEvents);
      return {
        ...state,
        events: filteredEvents
      };
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload
      };
    default:
      return state;
  }
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  useEffect(() => {
    const appData = initializeAppData();
    dispatch({ type: 'INITIALIZE_EVENTS', payload: appData.events });
    dispatch({ type: 'INITIALIZE_CATEGORIES', payload: appData.categories });
  }, []);

  useEffect(() => {
    const fetchCompletedStatuses = async () => {
      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, 'observations'), where('date', '==', today));
      const snapshot = await getDocs(q);
      const completedMap: Record<string, boolean> = {};
      snapshot.forEach(doc => {
        const { title, completed } = doc.data();
        if (title && typeof completed === 'boolean') {
          completedMap[title] = completed;
        }
      });

      const updated = state.events.map(event => ({
        ...event,
        completed: completedMap[event.title] ?? event.completed
      }));

      dispatch({ type: 'SET_EVENTS', payload: updated });
    };

    if (state.initialized) {
      fetchCompletedStatuses();
    }
  }, [state.initialized]);

  useEffect(() => {
    if (state.initialized && state.events.length > 0) {
      scheduleNotificationsForEvents(state.events);
    }
  }, [state.initialized, state.events]);

  return (
    <EventsContext.Provider value={{ state, dispatch }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
