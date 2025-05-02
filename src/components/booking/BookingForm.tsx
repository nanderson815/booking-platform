"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { addDoc, collection, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { BlockedDateRange } from '@/types';

interface BookingFormProps {
  startDate: Date | null;
  endDate: Date | null;
  onBookingComplete: () => void;
}

export function BookingForm({ startDate, endDate, onBookingComplete }: BookingFormProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !startDate || !endDate) return;

    setLoading(true);
    try {
      // Fetch blocked dates from Firestore
      const blockedRef = collection(db, 'blockedDates');
      const blockedQuery = query(blockedRef);
      const blockedSnapshot = await getDocs(blockedQuery);
      
      const blockedRanges = blockedSnapshot.docs.map(doc => ({
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      })) as BlockedDateRange[];
      
      // Check if any dates in the range are blocked
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const isBlocked = blockedRanges.some(range => 
          currentDate >= range.startDate && currentDate <= range.endDate
        );
        
        if (isBlocked) {
          toast.error(`${format(currentDate, 'PPP')} is blocked by the owner.`);
          setLoading(false);
          return;
        }
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Check capacity for each date
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('endDate', '>=', startDate));
      const querySnapshot = await getDocs(q);
      
      const existingBookings = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        guestCount: doc.data().guestCount || 1,
      }));

      // Check if adding this booking would exceed capacity
      for (const date of dates) {
        const bookingsOnDate = existingBookings.filter(booking => 
          date >= booking.startDate && date <= booking.endDate
        );
        const totalGuests = bookingsOnDate.reduce((sum, booking) => sum + booking.guestCount, 0);
        
        if (totalGuests + guestCount > 8) {
          toast.error(`Cannot book ${format(date, 'PPP')} - would exceed capacity (${totalGuests + guestCount}/8 guests)`);
          setLoading(false);
          return;
        }
      }

      // Create the booking
      await addDoc(collection(db, 'bookings'), {
        userId: user.id,
        userEmail: user.email,
        userName: user.displayName || user.email,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        notes,
        guestCount,
        createdAt: Timestamp.now(),
      });

      toast.success('Booking created successfully!');
      onBookingComplete();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!startDate || !endDate) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Booking details</h2>
        <p className="text-gray-700">Please select dates on the calendar first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Booking details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Selected Dates</label>
          <p className="text-gray-900">
            {format(startDate, 'PPP')} - {format(endDate, 'PPP')}
          </p>
        </div>
        <div>
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-900 mb-1">
            Number of guests
          </label>
          <select
            id="guestCount"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] outline-none transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] outline-none transition-all"
            placeholder="Any special notes or requests..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF385C] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#E61E4D] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Creating Booking...' : 'Reserve'}
        </button>
      </form>
    </div>
  );
}