import { Event, EventCategory, EventsState } from '../types/Event';
import { defaultEvents } from '../data/defaultEvents';
import { defaultEventCategories } from '../data/eventCategories';

const EVENTS_STORAGE_KEY = 'productivity-app-events';
const CATEGORIES_STORAGE_KEY = 'productivity-app-categories';
const INITIALIZED_KEY = 'productivity-app-initialized';

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

export const loadEvents = (): Event[] => {
  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  
  if (storedEvents) {
    return JSON.parse(storedEvents);
  }
  
  return [];
};

export const saveCategories = (categories: EventCategory[]): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const loadCategories = (): EventCategory[] => {
  const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  
  return [];
};

export const markAppInitialized = (): void => {
  localStorage.setItem(INITIALIZED_KEY, 'true');
};

export const isAppInitialized = (): boolean => {
  return localStorage.getItem(INITIALIZED_KEY) === 'true';
};

export const initializeAppData = (): EventsState => {
  if (!isAppInitialized()) {
    saveEvents(defaultEvents);
    saveCategories(defaultEventCategories);
    markAppInitialized();
    
    return {
      events: defaultEvents,
      categories: defaultEventCategories,
      initialized: true
    };
  }
  
  return {
    events: loadEvents(),
    categories: loadCategories(),
    initialized: true
  };
};