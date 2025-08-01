
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';

const ClientBookingPage = () => {
  // Mock notary data - this would come from props or API
  const notary = {
    id: 1,
    name: 'John Smith',
    email: 'john@notary.com',
    specialties: ['Real Estate', 'Legal Documents']
  };

  // Mock weekly schedule
  const weeklySchedule = {
    monday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    friday: { isAvailable: true, startTime: '09:00', endTime: '16:00' },
    saturday: { isAvailable: true, startTime: '10:00', endTime: '14:00' },
    sunday: { isAvailable: false, startTime: '10:00', endTime: '14:00' }
  };

  // Mock services with different durations
  const services = [
    { id: 1, name: 'Document Notarization', duration: 30, price: 25 },
    { id: 2, name: 'Real Estate Closing', duration: 60, price: 75 },
    { id: 3, name: 'Will Signing', duration: 45, price: 50 },
    { id: 4, name: 'Power of Attorney', duration: 30, price: 35 },
    { id: 5, name: 'Loan Documents', duration: 90, price: 100 }
  ];

  // Mock existing appointments (to block out time slots)
  const existingAppointments = [
    { date: '2025-07-17', time: '10:00', duration: 60 },
    { date: '2025-07-17', time: '14:00', duration: 30 },
    { date: '2025-07-18', time: '11:00', duration: 45 }
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Get day name from date
  const getDayName = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date(date).getDay()];
  };

  // Find next available date
  const findNextAvailableDate = () => {
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Check next 30 days
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayName = getDayName(checkDate.toISOString().split('T')[0]);
      
      if (weeklySchedule[dayName]?.isAvailable) {
        return checkDate.toISOString().split('T')[0];
      }
    }
    return today.toISOString().split('T')[0]; // Fallback to today
  };

  // Initialize with next available date
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(findNextAvailableDate());
    }
  }, []);

  // Check if a time slot is available
  const isTimeSlotAvailable = (date, startTime, duration) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + duration;

    return !existingAppointments.some(apt => {
      if (apt.date !== date) return false;
      
      const aptStartMinutes = timeToMinutes(apt.time);
      const aptEndMinutes = aptStartMinutes + apt.duration;
      
      // Check for overlap
      return (startMinutes < aptEndMinutes && endMinutes > aptStartMinutes);
    });
  };

  // Convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Generate available time slots based on service duration
  const getAvailableTimeSlots = (date, serviceDuration) => {
    if (!date || !serviceDuration) return [];
    
    const dayName = getDayName(date);
    const daySchedule = weeklySchedule[dayName];
    
    if (!daySchedule?.isAvailable) return [];

    const startMinutes = timeToMinutes(daySchedule.startTime);
    const endMinutes = timeToMinutes(daySchedule.endTime);
    const slots = [];

    // Generate slots every 15 minutes (you can adjust this interval)
    for (let time = startMinutes; time + serviceDuration <= endMinutes; time += 15) {
      const timeStr = minutesToTime(time);
      
      if (isTimeSlotAvailable(date, timeStr, serviceDuration)) {
        slots.push({
          time: timeStr,
          endTime: minutesToTime(time + serviceDuration)
        });
      }
    }

    return slots;
  };

  // Navigate dates
  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setSelectedDate(newDate.toISOString().split('T')[0]);
    setSelectedTime(null); // Reset selected time when date changes
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle booking submission
  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      alert('Please fill in all required fields');
      return;
    }

    const bookingData = {
      notaryId: notary.id,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      clientName,
      clientEmail,
      clientPhone
    };

    console.log('Booking Data:', bookingData);
    alert('Booking request submitted! The notary will review and confirm your appointment.');
    
    // Reset form
    setSelectedService(null);
    setSelectedDate(findNextAvailableDate());
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  const availableSlots = selectedService ? getAvailableTimeSlots(selectedDate, selectedService.duration) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                <span className="font-medium text-blue-800">{notary.name}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Specialties: {notary.specialties.join(', ')}
              </p>
            </div>
          </div>

          {/* Step 1: Select Service */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Select Service Type</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a service
              </label>
              <select
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const service = services.find(s => s.id === parseInt(e.target.value));
                  setSelectedService(service || null);
                  setSelectedTime(null); // Reset time when service changes
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a service...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.duration} min - ${service.price}
                  </option>
                ))}
              </select>
              
              {selectedService && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">{selectedService.name}</div>
                  <div className="text-sm text-blue-600 mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {selectedService.duration} minutes
                    </span>
                    <span className="font-medium">${selectedService.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Select Date & Time */}
          {selectedService && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Select Date & Time</h2>
              
              {/* Date Navigation */}
              <div className="mb-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <button
                    onClick={() => navigateDate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="text-center">
                    <div className="font-medium text-lg">{formatDate(selectedDate)}</div>
                    <div className="text-sm text-gray-600">
                      {getDayName(selectedDate).charAt(0).toUpperCase() + getDayName(selectedDate).slice(1)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigateDate(1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="font-medium mb-3">
                  Available Times ({selectedService.duration} minute slots)
                </h3>
                
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{slot.time}</div>
                        <div className="text-xs text-gray-500">to {slot.endTime}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No available slots for this date</p>
                    <p className="text-sm">Try selecting a different date</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {selectedService && selectedTime && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Your Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Summary & Submit */}
          {selectedService && selectedTime && clientName && clientEmail && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Notary:</span>
                  <span className="font-medium">{notary.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">
                    {selectedTime} - {minutesToTime(timeToMinutes(selectedTime) + selectedService.duration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedService.duration} minutes</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedService.price}</span>
                </div>
              </div>
              
              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Request Appointment
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Your appointment request will be sent to the notary for approval. 
                You'll receive a confirmation email once approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientBookingPage;