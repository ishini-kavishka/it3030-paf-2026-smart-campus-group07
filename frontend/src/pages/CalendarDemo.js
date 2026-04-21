import React from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CalendarDemo = () => {
    const navigate = useNavigate();
    
    // Mock bookings
    const mockBookings = [
        { date: '2026-04-22', startTime: '10:00', endTime: '11:00' },
        { date: '2026-04-22', startTime: '13:00', endTime: '14:00' },
        { date: '2026-04-23', startTime: '09:00', endTime: '18:00' }, 
        { date: '2026-04-24', startTime: '11:00', endTime: '12:00' },
        { date: '2026-04-21', startTime: '15:00', endTime: '16:00' },
    ];

    return (
        <div className="catalogue-page animate-in">
            <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, #534AB7 0%, #111827 100%)', borderColor: '#534AB7', marginBottom: '2rem' }}>
                <div className="hero-content">
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-ghost mb-6"
                        style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <div className="hero-badge">Component Demo</div>
                    <h1 className="hero-title text-white" style={{ color: '#fff' }}>Availability Calendar</h1>
                    <p className="hero-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Premium date and time selection component with real-time status indicators.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8">
                <AvailabilityCalendar 
                    initialBookings={mockBookings}
                    onDateSelect={(date) => console.log("Selected date:", date)}
                />
                
                <div className="mt-12 glass-card max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-4">Features Demonstrated:</h2>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span><strong>Dynamic Navigation:</strong> Smooth transitions between months.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span><strong>Status Indicators:</strong> Visual cues for available, partially booked, and full dates.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span><strong>Time Slot Calculation:</strong> Automatically detects busy slots based on daily bookings.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span><strong>Working Hours:</strong> Configurable range (default 9 AM - 6 PM).</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span><strong>Responsive & Premium:</strong> Built with Tailwind CSS and glassmorphism effects.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CalendarDemo;
