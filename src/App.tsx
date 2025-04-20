import React, { useState, useEffect } from 'react';
import { EventsProvider } from './context/EventsContext';
import Header from './components/Header';
import DailySchedule from './components/DailySchedule';
import CurrentEvent from './components/CurrentEvent';
import { checkNotificationPermission } from './utils/notificationUtils';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // Request notification permission on app load
    const requestPermission = async () => {
      await checkNotificationPermission();
    };
    
    requestPermission();
    
    // Update document title
    document.title = 'Personal Productivity';
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  return (
    <EventsProvider>
      <div className="flex flex-col min-h-screen bg-dark-500 text-gray-100">
        <Header 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
        
        <main className="flex-grow mb-auto">
          <DailySchedule selectedDate={selectedDate} />
        </main>
        
        <footer className="mt-auto">
          <CurrentEvent selectedDate={selectedDate} />
        </footer>
      </div>
    </EventsProvider>
  );
}

export default App;