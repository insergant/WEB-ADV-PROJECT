import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirecting guests
import { API_BASE_URL } from '../config';

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // New event form state (for Leaders/Admins)
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    maxCapacity: 30
  });

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
      // Only attach the auth header if the user is actually logged in
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/events`, { headers });
      const data = await res.json();
      
      if (res.ok) {
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegister = async (eventId, isRegistered) => {
    if (!token) {
      navigate('/login'); // Redirect guests to login page
      return;
    }

    const method = isRegistered ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchEvents(); // Refresh data to show updated capacity
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Event created successfully!');
        setShowForm(false);
        setNewEvent({ title: '', description: '', location: '', eventDate: '', maxCapacity: 30 });
        fetchEvents();
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Failed to create event.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Scout Events and Activities</h2>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#e2e8f0', marginBottom: '15px', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {user && (user.role === 'leader' || user.role === 'admin') && (
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{ padding: '10px 15px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
        >
          {showForm ? 'Cancel' : '+ Create New Event'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleCreateEvent} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
          <h3>Create Event</h3>
          <input 
            type="text" placeholder="Event Title" value={newEvent.title} 
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
            required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <textarea 
            placeholder="Description" value={newEvent.description} 
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input 
            type="text" placeholder="Location" value={newEvent.location} 
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
            required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input 
            type="datetime-local" value={newEvent.eventDate} 
            onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} 
            required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input 
            type="number" placeholder="Max Capacity" value={newEvent.maxCapacity} 
            onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })} 
            required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2f855a', color: 'white', border: 'none', borderRadius: '4px' }}>
            Publish Event
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {events.map((evt) => {
            const isFull = evt.registered_count >= evt.max_capacity;
            const isRegistered = Boolean(evt.is_user_registered);

            return (
              <div key={evt.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#f7fafc' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{evt.title}</h3>
                <p>{evt.description}</p>
                <p><strong>Location:</strong> {evt.location}</p>
                <p><strong>Date:</strong> {new Date(evt.event_date).toLocaleString()}</p>
                <p><strong>Capacity:</strong> {evt.registered_count} / {evt.max_capacity} registered</p>
                
                <button
                  onClick={() => handleRegister(evt.id, isRegistered)}
                  disabled={!isRegistered && isFull && token}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: !token ? '#4a5568' : isRegistered ? '#e53e3e' : isFull ? '#cbd5e0' : '#319795',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (!isRegistered && isFull && token) ? 'not-allowed' : 'pointer',
                    marginTop: '10px'
                  }}>
                  {!token ? 'Log in to RSVP' : isRegistered ? 'Cancel RSVP' : isFull ? 'Event Full' : 'RSVP / Register'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;