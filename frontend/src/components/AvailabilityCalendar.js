import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Info } from 'lucide-react';
import axios from 'axios';

/**
 * AvailabilityCalendar Component
 * 
 * Props:
 * - initialBookings: Array of { date, startTime, endTime } (ISO strings or YYYY-MM-DD)
 * - resourceId: If provided, will fetch bookings from the API
 * - workingHours: { start: number, end: number } (hour in 24h format, default 9-18)
 * - onDateSelect: Callback when a date is clicked
 */
const AvailabilityCalendar = ({ 
  initialBookings = [], 
  resourceId = null, 
  workingHours = { start: 9, end: 18 },
  onDateSelect = () => {}
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bookings if resourceId is provided
  useEffect(() => {
    if (resourceId) {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          // Adjust the endpoint as per your backend structure
          const response = await axios.get(`/api/bookings?resourceId=${resourceId}`);
          setBookings(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError("Failed to load availability. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [resourceId]);

  // Calendar Logic
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Resource Availability
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-600 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-600 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-gray-50">
        {days.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-indigo-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Calculate status for this day
        const dayBookings = bookings.filter(b => isSameDay(parseISO(b.date), cloneDay));
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
        
        const isBooked = dayBookings.length >= 5; 
        const isPartiallyBooked = dayBookings.length > 0 && dayBookings.length < 5;

        days.push(
          <div
            key={day.toString()}
            className={`relative py-4 text-center cursor-pointer transition-all duration-200 group
              ${!isCurrentMonth ? "text-gray-300 pointer-events-none" : "text-gray-700"}
              ${isSelected ? "bg-indigo-50 font-bold scale-105 z-10 rounded-xl shadow-sm" : ""}
              ${isPast ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 hover:rounded-xl"}
            `}
            onClick={() => !isPast && (setSelectedDate(cloneDay), onDateSelect(cloneDay))}
          >
            <span className={`relative z-10 ${isSelected ? "text-indigo-600" : ""}`}>
              {formattedDate}
            </span>
            
            {/* Status Indicators */}
            {isCurrentMonth && !isPast && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {isBooked ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-sm shadow-red-100"></div>
                ) : isPartiallyBooked ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-100"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-100"></div>
                )}
              </div>
            )}
            
            {/* Selection Ring */}
            {isSelected && (
              <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-xl pointer-events-none"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  // Time Slots logic for selected date
  const selectedDateBookings = useMemo(() => {
    return bookings.filter(b => isSameDay(parseISO(b.date), selectedDate));
  }, [bookings, selectedDate]);

  const availableSlots = useMemo(() => {
    const slots = [];
    const startHour = workingHours.start;
    const endHour = workingHours.end;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = `${hour.toString().padStart(2, '0')}:00`;
      const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const isOccupied = selectedDateBookings.some(b => {
        const bStart = b.startTime.substring(0, 5);
        const bEnd = b.endTime.substring(0, 5);
        return (slotStart >= bStart && slotStart < bEnd) || (bStart >= slotStart && bStart < slotEnd);
      });
      
      slots.push({
        time: `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        raw: slotStart,
        available: !isOccupied
      });
    }
    return slots;
  }, [selectedDateBookings, workingHours]);

  return (
    <div className="glass-card shadow-xl border-0 overflow-hidden bg-white/90 backdrop-blur-md animate-in max-w-md w-full">
      {/* Calendar Section */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="loader-ring"></div>
          </div>
        )}
        
        {renderHeader()}
        <div className="p-2">
          {renderDays()}
          {renderCells()}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50/50 flex justify-center gap-6 border-y border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Booked</span>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-800">
            <Clock size={16} className="text-indigo-500" />
            <h4 className="font-bold text-sm">Available Slots</h4>
          </div>
          <span className="text-[11px] font-medium text-gray-400 px-2 py-1 bg-gray-100 rounded-md">
            {format(selectedDate, "EEE, MMM d")}
          </span>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-center text-red-600 text-xs">
            <Info size={14} />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                disabled={!slot.available}
                className={`py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all
                  ${slot.available 
                    ? "bg-white border border-gray-100 text-indigo-600 hover:border-indigo-400 hover:shadow-md hover:scale-105" 
                    : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}

        {availableSlots.every(s => !s.available) && !error && (
          <div className="text-center py-6">
            <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarIcon size={18} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-xs font-medium">No slots available for this date</p>
          </div>
        )}
      </div>
      
      {/* Footer info */}
      <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Info size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Instant Booking</p>
            <p className="text-xs font-medium">Select a slot to continue</p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm">
          Next Step
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
