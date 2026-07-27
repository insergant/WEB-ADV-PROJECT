import React from 'react';
import { Link } from 'react-router-dom';
import { FaCampground, FaShieldAlt, FaUsers } from 'react-icons/fa';
const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white rounded-2xl p-8 md:p-16 text-center shadow-lg relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Adventure, Leadership, & Character
          </h1>
          <p className="text-lg md:text-xl text-emerald-200">
            Welcome to Muslim Scouts. Empowering the next generation through outdoor exploration, community service, and lifelong skills.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/register" 
              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-3 px-8 rounded-lg shadow transition transform hover:-translate-y-0.5"
            >
              Register Now
            </Link>
            <Link 
              to="/services" 
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg border border-emerald-600 transition"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="inline-block p-4 bg-emerald-100 text-emerald-800 rounded-full text-2xl">
            <FaCampground />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Outdoor Adventure</h3>
          <p className="text-slate-600">
            Gain hands-on experience through camping, hiking, wilderness survival, and nature conservation projects.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="inline-block p-4 bg-emerald-100 text-emerald-800 rounded-full text-2xl">
            <FaUsers />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Community Building</h3>
          <p className="text-slate-600">
            Build strong bonds, develop teamwork ethics, and participate in impactful local community service initiatives.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="inline-block p-4 bg-emerald-100 text-emerald-800 rounded-full text-2xl">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Leadership Training</h3>
          <p className="text-slate-600">
            Learn accountability, decision-making, and problem-solving through structured rank advancements and responsibilities.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Home;