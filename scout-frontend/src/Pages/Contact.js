import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-emerald-900">Get in Touch</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Have questions about our upcoming scout camps, troop meetings, or registration steps? Reach out below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">Contact Information</h3>
          
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-lg mt-1">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Headquarters</h4>
              <p className="text-slate-600 text-sm">Scout grounds ,Majel Anjar ,Lebanon</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-lg mt-1">
              <FaPhone />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Phone Number</h4>
              <p className="text-slate-600 text-sm">+961 (70) 570290</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-lg mt-1">
              <FaEnvelope />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Email Address</h4>
              <p className="text-slate-600 text-sm">support@muslimscouts.org</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-lg text-center space-y-2">
              <h4 className="font-bold text-lg">Message Sent Successfully!</h4>
              <p className="text-sm">Thank you for reaching out. A scout leader will respond to your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Send Us a Message</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={contactForm.name} 
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={contactForm.email} 
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={contactForm.message} 
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500" 
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-700 text-white font-bold py-2 px-4 rounded hover:bg-emerald-800 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default Contact;