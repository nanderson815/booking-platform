"use client";

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { isSameDay } from 'date-fns';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, BlockedDateRange } from '@/types';
import 'react-calendar/dist/Calendar.css';

interface BookingCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
}

export function BookingCalendar({ onSelectDate, selectedStartDate, selectedEndDate }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedRanges, setBlockedRanges] = useState<BlockedDateRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchBlockedDates();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const now = new Date();
      const q = query(bookingsRef, where('endDate', '>=', now));
      const querySnapshot = await getDocs(q);
      
      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Booking[];
      
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  
  const fetchBlockedDates = async () => {
    try {
      const blockedRef = collection(db, 'blockedDates');
      const now = new Date();
      const q = query(blockedRef, where('endDate', '>=', now));
      const querySnapshot = await getDocs(q);
      
      const fetchedBlocks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BlockedDateRange[];
      
      setBlockedRanges(fetchedBlocks);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBlocked = (date: Date): boolean => {
    return blockedRanges.some(range => 
      date >= range.startDate && date <= range.endDate
    );
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    // Check if date is in admin-blocked dates
    const isAdminBlocked = isDateBlocked(date);
    
    // Calculate total guests on this date
    const bookingsOnDate = bookings.filter(booking => 
      date >= booking.startDate && date <= booking.endDate
    );
    
    const totalGuests = bookingsOnDate.reduce((sum, booking) => sum + booking.guestCount, 0);
    const isFullyBooked = totalGuests >= 8; // House capacity
    
    // Check if this date is selected by user
    const isSelected = (selectedStartDate && isSameDay(date, selectedStartDate)) ||
                      (selectedEndDate && isSameDay(date, selectedEndDate)) ||
                      (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate);
    
    // Apply appropriate styling based on conditions
    if (isAdminBlocked) return 'admin-blocked-date';  // CSS class for admin-blocked dates
    if (isSelected && !isFullyBooked) return 'bg-blue-500 text-white rounded-lg';
    if (isFullyBooked) return 'bg-red-500 text-white cursor-not-allowed';
    if (bookingsOnDate.length > 0) return 'partial-booked-date'; // CSS class for partially booked
    return '';
  };

  const getTileContent = ({ date }: { date: Date }) => {
    const isAdminBlocked = isDateBlocked(date);
    const bookingsOnDate = bookings.filter(booking => 
      date >= booking.startDate && date <= booking.endDate
    );
    
    const totalGuests = bookingsOnDate.reduce((sum, booking) => sum + booking.guestCount, 0);
    
    if (isAdminBlocked) {
      return <div className="text-xs mt-1 font-medium">Blocked</div>;
    }
    
    if (bookingsOnDate.length > 0) {
      return (
        <div className="text-xs mt-1 font-medium">
          {totalGuests}/8 guests
        </div>
      );
    }
    return null;
  };

  const handleClickDay = (date: Date) => {
    const isAdminBlocked = isDateBlocked(date);
    
    // Don't allow selecting admin-blocked dates
    if (isAdminBlocked) {
      import('react-toastify').then(({ toast }) => {
        toast.error('This date is blocked by the owner.');
      });
      return;
    }
    
    // Calculate total guests for this date
    const bookingsOnDate = bookings.filter(booking => 
      date >= booking.startDate && date <= booking.endDate
    );
    const totalGuests = bookingsOnDate.reduce((sum, booking) => sum + booking.guestCount, 0);
    
    // Check if house is fully booked
    if (totalGuests >= 8) {
      import('react-toastify').then(({ toast }) => {
        toast.error('This date is fully booked (8/8 guests).');
      });
      return;
    }
    
    // Allow selection if there's still capacity
    onSelectDate(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Select dates</h2>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Calendar
          onChange={handleClickDay}
          value={selectedStartDate}
          tileClassName={getTileClassName}
          tileContent={getTileContent}
          minDate={new Date()}
          className="w-full border-none"
        />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
          <span className="text-gray-700 font-medium">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700 font-medium">Fully booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-600 rounded"></div>
          <span className="text-gray-700 font-medium">Partial capacity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-900 rounded"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span className="text-gray-700 font-medium">Available</span>
        </div>
      </div>
    </div>
  );
}