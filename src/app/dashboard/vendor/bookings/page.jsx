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
        setBookings(res || []);
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
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      // optimistic UI update
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // SAFE PRICE CALC
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
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Requested Bookings
      </h1>

      {/* TABLE */}
      <div className="hidden md:block overflow-x-auto">
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
                    onClick={() =>
                      updateBookingStatus(b._id, "accepted")
                    }
                    disabled={b.status === "accepted"}
                    className="px-3 py-1 rounded bg-green-600 disabled:opacity-40"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateBookingStatus(b._id, "rejected")
                    }
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

      {/* MOBILE */}
      <div className="grid gap-4 md:hidden">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border border-zinc-800 rounded-xl p-4 bg-zinc-900"
          >

            <p className="text-sm text-zinc-400">
              {b.userEmail}
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {b.ticketTitle}
            </h3>

            <div className="mt-2 flex justify-between text-sm">
              <span>Qty: {b.quantity}</span>

              <span className="text-green-400 font-semibold">
                ৳{b.totalPrice ?? getTotalPrice(b)}
              </span>
            </div>

            <div className="mt-3">
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
            </div>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() =>
                  updateBookingStatus(b._id, "accepted")
                }
                disabled={b.status === "accepted"}
                className="flex-1 px-3 py-2 rounded bg-green-600 disabled:opacity-40"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  updateBookingStatus(b._id, "rejected")
                }
                disabled={b.status === "rejected"}
                className="flex-1 px-3 py-2 rounded bg-red-600 disabled:opacity-40"
              >
                Reject
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default RequestedBookingsPage;