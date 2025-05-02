export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  guestCount: number; // New field for shared bookings
  createdAt: Date;
}

export interface CalendarDate {
  date: Date;
  isBooked: boolean;
  booking?: Booking;
}

export interface BlockedDateRange {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
}