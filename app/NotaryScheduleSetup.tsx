"use client"

import React, { useState, useId } from 'react';
import { Calendar, Clock, DollarSign, Plus, X, Save, Info } from 'lucide-react';


const NotaryScheduleSetup = () => {
  const formId = useId();
  
  // Days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Initial schedule state
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, timeSlots: [] }
    }), {})
  );
  
  // Services state
  const [services, setServices] = useState([
    { id: 1, name: 'Standard Notarization', duration: 30, price: 25 },
    { id: 2, name: 'Real Estate Closing', duration: 120, price: 150 }
  ]);
  
  // New service form state
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });
  const [showServiceForm, setShowServiceForm] = useState(false);
  
  // Toggle day availability
  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        timeSlots: !prev[day].enabled ? [{ start: '09:00', end: '17:00' }] : []
      }
    }));
  };
  
  // Add time slot
  const addTimeSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: '09:00', end: '17:00' }]
      }
    }));
  };
  
  // Remove time slot
  const removeTimeSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Update time slot
  const updateTimeSlot = (day, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };
  
  // Add new service
  const addService = () => {
    if (newService.name && newService.duration > 0 && newService.price >= 0) {
      setServices(prev => [...prev, { ...newService, id: Date.now() }]);
      setNewService({ name: '', duration: 30, price: 0 });
      setShowServiceForm(false);
    }
  };
  
  // Remove service
  const removeService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };
  
  // Save configuration
  const saveConfiguration = () => {
    console.log('Saving configuration:', { schedule, services });
    // Here you would typically send this data to your backend
    alert('Schedule configuration saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Up Your Availability
          </h1>
          <p className="text-gray-600">
            Configure your weekly schedule and services offered
          </p>
        </header>

        {/* Services Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" aria-hidden="true" />
              Services Offered
            </h2>
            <button
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Add new service"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Service
            </button>
          </div>

          {/* Services List */}
          <div className="space-y-3" role="list" aria-label="Services list">
            {services.map(service => (
              <div
                key={service.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200"
                role="listitem"
              >
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{service.duration} minutes</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" aria-hidden="true" />
                      <span>${service.price}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeService(service.id)}
                  className="self-start sm:self-auto text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded p-1"
                  aria-label={`Remove ${service.name} service`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Service Form */}
          {showServiceForm && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-gray-900 mb-4">Add New Service</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`${formId}-service-name`} className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input
                    id={`${formId}-service-name`}
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Loan Signing"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-service-duration`} className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      id={`${formId}-service-duration`}
                      type="number"
                      min="15"
                      step="15"
                      value={newService.duration}
                      onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-service-price`} className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price ($)
                    </label>
                    <input
                      id={`${formId}-service-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addService}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Service
                  </button>
                  <button
                    onClick={() => {
                      setShowServiceForm(false);
                      setNewService({ name: '', duration: 30, price: 0 });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Weekly Schedule Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            Weekly Schedule
          </h2>
          
          <div className="space-y-4">
            {daysOfWeek.map(day => (
              <div key={day} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule[day].enabled}
                      onChange={() => toggleDay(day)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      aria-label={`Enable ${day}`}
                    />
                    <span className="font-medium text-gray-900">{day}</span>
                  </label>
                  {schedule[day].enabled && (
                    <button
                      onClick={() => addTimeSlot(day)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-2 py-1"
                      aria-label={`Add time slot for ${day}`}
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      Add Time Slot
                    </button>
                  )}
                </div>
                
                {schedule[day].enabled && (
                  <div className="space-y-2 mt-3">
                    {schedule[day].timeSlots.map((slot, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <label htmlFor={`${formId}-${day}-start-${index}`} className="sr-only">
                            Start time for {day} slot {index + 1}
                          </label>
                          <input
                            id={`${formId}-${day}-start-${index}`}
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <span className="text-gray-500" aria-hidden="true">to</span>
                          <label htmlFor={`${formId}-${day}-end-${index}`} className="sr-only">
                            End time for {day} slot {index + 1}
                          </label>
                          <input
                            id={`${formId}-${day}-end-${index}`}
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        {schedule[day].timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(day, index)}
                            className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded p-1"
                            aria-label={`Remove time slot ${index + 1} for ${day}`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveConfiguration}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Save className="w-5 h-5" aria-hidden="true" />
            Save Schedule Configuration
          </button>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Schedule configuration form loaded
        </div>
      </div>
    </div>
  );
};

export default NotaryScheduleSetup;