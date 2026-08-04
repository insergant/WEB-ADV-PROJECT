import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const scoutPrograms = [
  { id: 1, name: 'Cub Scouts', age: 'Ages 7-10', description: 'Focuses on family, citizenship, personal fitness, and fun introductory outdoor activities.', category: 'junior' },
  { id: 2, name: 'Boy / Girl Scouts', age: 'Ages 11-17', description: 'Advanced outdoor skill-building, merit badges, leadership roles, and major camping expeditions.', category: 'senior' },
  { id: 3, name: 'Rover Scouts', age: 'Ages 18-25', description: 'Service to the community, advanced outdoor leadership, mentoring younger troops, and professional networking.', category: 'adult' },
  { id: 4, name: 'Wilderness Survival Track', age: 'Ages 12+', description: 'Intensive weekend workshops focused on tracking, shelter building, and first-aid response.', category: 'senior' }
];

const Services = () => {
  const [filter, setFilter] = useState('all');
  const [dbEvents, setDbEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        setDbEvents(data);  
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading database events:', err);
        setLoading(false);
      });
  }, []);

  const filteredPrograms = filter === 'all' 
    ? scoutPrograms 
    : scoutPrograms.filter(program => program.category === filter);
const safeEvents = Array.isArray(dbEvents) ? dbEvents : [];
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-emerald-900">Scout Programs & Activities</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Explore our tailored programs designed for every stage of a scout's journey. Use the filter below to find the right track.
          </p>

          <div className="flex justify-center space-x-2 pt-4">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              All Programs
            </button>
            <button 
              onClick={() => setFilter('junior')} 
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'junior' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              Junior
            </button>
            <button 
              onClick={() => setFilter('senior')} 
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'senior' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              Senior & Wilderness
            </button>
            <button 
              onClick={() => setFilter('adult')} 
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'adult' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              Rovers
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between transition transform hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-emerald-900">{program.name}</h3>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    {program.age}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4">{program.description}</p>
              </div>
              <button className="self-start text-sm font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center space-x-1">
                <span>Learn More &rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-200" />

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-emerald-900">Upcoming Events</h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Connecting to database server...</p>
        ) : dbEvents.length === 0 ? (
          <div className="text-center bg-slate-100 p-6 rounded-lg text-slate-600">
            No upcoming events found. Please check back later or contact us for more information.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {safeEvents.map((event) => (
  <div key={event.id} className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-sm space-y-3">
    <span className="text-xs font-semibold bg-emerald-800 text-white px-3 py-1 rounded-full">
      {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA'}
    </span>
    <h3 className="text-xl font-bold text-emerald-900">{event.title}</h3>
    <p className="text-slate-700 text-sm">{event.description}</p>
    <p className="text-xs text-emerald-800 font-semibold">📍 Location: {event.location}</p>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;