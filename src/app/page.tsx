"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookingCalendar } from '@/components/calendar/BookingCalendar';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingList } from '@/components/booking/BookingList';
import { LoginButton } from '@/components/auth/LoginButton';
import { HouseInfo } from '@/components/house/HouseInfo';
import { BlockDatesForm } from '@/components/admin/BlockDatesForm';

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectDate = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (date < selectedStartDate) {
      setSelectedEndDate(selectedStartDate);
      setSelectedStartDate(date);
    } else {
      setSelectedEndDate(date);
    }
  };

  const handleCalendarRefresh = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white px-4">
        <div className="container mx-auto py-10 sm:py-16 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to Lake House</h1>
            <p className="text-gray-600 mb-8">
              Sign in to reserve your stay
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#FF385C]">Lake House</h1>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <BookingCalendar
              key={refreshKey}
              onSelectDate={handleSelectDate}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
            />
            <HouseInfo />
          </div>
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <BookingForm
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              onBookingComplete={handleCalendarRefresh}
            />
            <BookingList key={refreshKey} onBookingChange={handleCalendarRefresh} />
            <BlockDatesForm onBlockComplete={handleCalendarRefresh} />
          </div>
        </div>
      </main>
    </div>
  );
}