"use client";

import { getBookingsTickets } from "@/lib/api/tickets";
import { useEffect, useState } from "react";

const RequestedBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getBookingsTickets();
        setBookings(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // UPDATE STATUS
  const updateBookingStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status } : b
      )
    );
  };

  // SAFE CALC (backup if DB wrong)
  const getTotalPrice = (b) => {
    const price = Number(b.unitPrice || 0);
    const qty = Number(b.quantity || 0);
    return price * qty;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-zinc-950">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Requested Bookings
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-zinc-800">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Ticket</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-zinc-800">

                <td className="p-3">{b.userEmail}</td>
                <td className="p-3">{b.ticketTitle}</td>
                <td className="p-3">{b.quantity}</td>

                {/* FIXED */}
                <td className="p-3 text-green-400 font-semibold">
                  ৳{b.totalPrice ?? getTotalPrice(b)}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      b.status === "accepted"
                        ? "bg-green-600"
                        : b.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateBookingStatus(b._id, "accepted")}
                    disabled={b.status === "accepted"}
                    className="px-3 py-1 rounded bg-green-600 disabled:opacity-40"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateBookingStatus(b._id, "rejected")}
                    disabled={b.status === "rejected"}
                    className="px-3 py-1 rounded bg-red-600 disabled:opacity-40"
                  >
                    Reject
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestedBookingsPage;