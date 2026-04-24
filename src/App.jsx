import { useState } from 'react'
import './App.css'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventText, setEventText] = useState("");
  const [events, setEvents] = useState({});

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDateKey = (day) => `${year}-${month}-${day}`;

  const handleAddEvent = () => {
    if (!selectedDay || !eventText.trim()) return;
    const dateKey = getDateKey(selectedDay);
    const dayEvents = events[dateKey] || [];
    setEvents({ ...events, [dateKey]: [...dayEvents, eventText] });
    setEventText("");
  };

  const deleteEvent = (dateKey, indexToDelete) => {
    const updatedEvents = { ...events };
    updatedEvents[dateKey] = updatedEvents[dateKey].filter((_, index) => index !== indexToDelete);
    if (updatedEvents[dateKey].length === 0) delete updatedEvents[dateKey];
    setEvents(updatedEvents);
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDay(null);
  };

  return (
    <div className="main-container">
      <div className="calendar-card">
        <header className="calendar-header">
          <button className="nav-btn" onClick={() => changeMonth(-1)}>&lt;</button>
          <h2>{monthNames[month]} {year}</h2>
          <button className="nav-btn" onClick={() => changeMonth(1)}>&gt;</button>
        </header>

        <div className="calendar-grid">
          {weekDays.map(day => <div key={day} className="weekday">{day}</div>)}
          
          {blanks.map((_, i) => <div key={`b-${i}`} className="day empty"></div>)}
          
          {daysArray.map(day => {
            const dateKey = getDateKey(day);
            const hasEvents = events[dateKey] && events[dateKey].length > 0;
            return (
              <div 
                key={day} 
                className={`day ${selectedDay === day ? 'active' : ''} ${hasEvents ? 'marked' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
                {hasEvents && <span className="dot"></span>}
              </div>
            )
          })}
        </div>

        {selectedDay && (
          <div className="schedule-box">
            <p className="date-label">{monthNames[month]} {selectedDay}, {year}</p>
            <div className="event-input">
              <input 
                value={eventText} 
                onChange={(e) => setEventText(e.target.value)} 
                placeholder="New event..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
              />
              <button onClick={handleAddEvent}>Add</button>
            </div>
            <ul className="list">
              {(events[getDateKey(selectedDay)] || []).map((ev, i) => (
                <li key={i} className="event-item">
                  <span>{ev}</span>
                  <button className="delete-btn" onClick={() => deleteEvent(getDateKey(selectedDay), i)}>×</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App