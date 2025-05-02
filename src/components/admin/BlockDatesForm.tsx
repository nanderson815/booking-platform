"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Calendar, X } from "lucide-react";
import { toast } from "react-toastify";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlockedDateRange } from "@/types";
import { ConfirmModal } from "../ui/ConfirmModal";

interface BlockDatesFormProps {
  onBlockComplete?: () => void;
}

export function BlockDatesForm({ onBlockComplete }: BlockDatesFormProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [blockedRanges, setBlockedRanges] = useState<BlockedDateRange[]>([]);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  const fetchBlockedDates = useCallback(async () => {
    try {
      const blockedRef = collection(db, 'blockedDates');
      const querySnapshot = await getDocs(blockedRef);
      
      const fetchedBlocks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BlockedDateRange[];
      
      setBlockedRanges(fetchedBlocks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchBlockedDates();
    }
  }, [user, fetchBlockedDates]);

  // Only show this component to admins
  if (!user?.isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'blockedDates'), {
        name: blockReason,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        createdBy: user.email,
        createdAt: Timestamp.now(),
      });

      toast.success("Dates blocked successfully!");
      setStartDate("");
      setEndDate("");
      setBlockReason("");
      fetchBlockedDates(); // Refresh the list
      onBlockComplete?.(); // Trigger calendar refresh
    } catch (error) {
      console.error('Error blocking dates:', error);
      toast.error('Failed to block dates');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockClick = (blockId: string) => {
    setBlockToDelete(blockId);
    setUnblockModalOpen(true);
  };

  const handleDeleteBlock = async () => {
    if (!blockToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'blockedDates', blockToDelete));
      toast.success('Dates unblocked successfully');
      fetchBlockedDates();
      onBlockComplete?.(); // Trigger calendar refresh
    } catch (error) {
      console.error('Error deleting blocked dates:', error);
      toast.error('Failed to unblock dates');
    } finally {
      setUnblockModalOpen(false);
      setBlockToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Block dates (Admin)
      </h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">
          Currently blocked dates:
        </h3>
        {blockedRanges.length === 0 ? (
          <p className="text-gray-600">No dates currently blocked.</p>
        ) : (
          <ul className="space-y-2">
            {blockedRanges.map((range) => (
              <li key={range.id} className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 mt-0.5 text-gray-700" />
                  <div>
                    <span className="font-medium">{range.name}:</span>{" "}
                    <span className="text-gray-700">
                      {format(range.startDate, 'PPP')} to {format(range.endDate, 'PPP')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblockClick(range.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Unblock these dates"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Start date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] outline-none transition-all"
              required
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              End date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] outline-none transition-all"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="blockReason"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Reason (e.g., &quot;Family vacation&quot;, &quot;Maintenance&quot;)
          </label>
          <input
            type="text"
            id="blockReason"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] outline-none transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Blocking dates..." : "Block these dates"}
        </button>
      </form>
      
      <ConfirmModal
        isOpen={unblockModalOpen}
        onClose={() => setUnblockModalOpen(false)}
        onConfirm={handleDeleteBlock}
        title="Unblock dates"
        message="Are you sure you want to unblock these dates? This will allow users to book during this period."
        confirmText="Unblock dates"
        cancelText="Cancel"
        isDestructive={false}
      />
    </div>
  );
}
