"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types";
import { format } from "date-fns";
import { toast } from "react-toastify";

export function BookingList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = useCallback(async () => {
    if (!user) return;

    try {
      const bookingsRef = collection(db, "bookings");
      const q = user.isAdmin
        ? query(bookingsRef)
        : query(bookingsRef, where("userId", "==", user.id));

      const querySnapshot = await getDocs(q);
      const fetchedBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Booking[];

      setBookings(
        fetchedBookings.sort(
          (a, b) => a.startDate.getTime() - b.startDate.getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      toast.success("Booking cancelled successfully");
      fetchUserBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [fetchUserBookings, user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        {user?.isAdmin ? "All reservations" : "Your reservations"}
      </h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                <div>
                  <h3 className="font-semibold">
                    {format(booking.startDate, "PPP")} -{" "}
                    {format(booking.endDate, "PPP")}
                  </h3>
                  <p className="text-sm text-gray-700">
                    By: {booking.userName} • {booking.guestCount}{" "}
                    {booking.guestCount === 1 ? "guest" : "guests"}
                  </p>
                  {booking.notes && (
                    <p className="text-sm text-gray-700 mt-1">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
