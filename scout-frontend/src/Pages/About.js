import React from 'react';
import { FaAward, FaCompass, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-emerald-900">About ScoutConnect</h2>
        <p className="text-slate-600 text-lg">
          For over a century, scouting has inspired young individuals to build character, train in outdoor leadership, and serve their local communities.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="inline-block p-3 bg-emerald-100 text-emerald-800 rounded-xl text-2xl">
            <FaCompass />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">Our Mission</h3>
          <p className="text-slate-600 leading-relaxed">
            To contribute to the education of young people through a value-based system built on the Scout Promise and Law, helping to build a better world where people are self-fulfilled as individuals and play a constructive role in society.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="inline-block p-3 bg-amber-100 text-amber-800 rounded-xl text-2xl">
            <FaAward />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">The Scout Law</h3>
          <p className="text-slate-600 leading-relaxed">
            A scout is trustworthy, loyal, helpful, friendly, courteous, kind, obedient, cheerful, thrifty, brave, clean, and reverent. These core values guide our daily activities, hikes, and community initiatives.
          </p>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="bg-emerald-900 text-white rounded-2xl p-8 md:p-12 text-center space-y-6">
        <div className="inline-block p-3 bg-emerald-800 text-amber-400 rounded-full text-2xl">
          <FaHeart />
        </div>
        <h3 className="text-3xl font-bold">Led by Experienced Mentors</h3>
        <p className="text-emerald-200 max-w-2xl mx-auto">
          Our registered troop leaders bring decades of combined experience in wilderness safety, youth development, and emergency first-aid preparedness.
        </p>
      </div>
    </div>
  );
}
export default About;