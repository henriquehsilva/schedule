export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  timeRange: TimeRange;
  daysOfWeek: DayOfWeek[];
  category: EventCategory;
  completed?: boolean;
}

export type EventsState = {
  events: Event[];
  categories: EventCategory[];
  initialized: boolean;
};

export type EventAction = 
  | { type: 'INITIALIZE_EVENTS'; payload: Event[] }
  | { type: 'TOGGLE_EVENT_COMPLETED'; payload: string }
  | { type: 'RESET_COMPLETED_EVENTS' }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'INITIALIZE_CATEGORIES'; payload: EventCategory[] }
  | { type: 'SET_EVENTS'; payload: Event[] };