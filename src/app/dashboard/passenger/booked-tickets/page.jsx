"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

/* ---------------- COUNTDOWN ---------------- */
function Countdown({ date }) {
  const calc = () => {
    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return null;

    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / 1000 / 60) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };

  const [t, setT] = useState(calc());

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (!t) return <span className="text-red-400">Expired</span>;

  return (
    <span className="text-sm font-medium text-zinc-200">
      {t.d}d {t.h}h {t.m}m {t.s}s
    </span>
  );
}

export default function TicketGrid() {
  const { data: session } = useSession();


  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [qty, setQty] = useState(1);


  /* ---------------- FETCH TICKETS ---------------- */
  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch("http://localhost:5000/api/tickets");
      const data = await res.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  /* ---------------- FETCH USER BOOKINGS ---------------- */
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings?userEmail=${session.user.email}`
        );
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  /* ---------------- BOOK TICKET ---------------- */
  const bookTicket = async (ticket) => {
    const payload = {
      ticketId: ticket._id,
      userEmail: session?.user?.email,
      ticketTitle: ticket.title,
      quantity: qty,
      unitPrice: ticket.price,
      totalPrice: ticket.price * qty,
      vendorId: ticket.vendorId,
    };

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Booking Sent to Vendor");

      const refresh = await fetch(
        `http://localhost:5000/api/bookings?userEmail=${session.user.email}`
      );

      const data = await refresh.json();
      setBookings(data || []);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "warning";
    }
  };

  const handlePayment = async (booking) => {
    const res = await fetch("http://localhost:3000/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: booking.totalPrice,
        ticketTitle: booking.ticketTitle,
        bookingId: booking._id,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">My Booked Tickets</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets
          .filter((t) =>
            bookings.some(
              (b) => String(b.ticketId) === String(t._id)
            )
          )
          .map((t) => {
            const departure = new Date(t.departureDateTime);
            const isExpired = Date.now() > departure.getTime();

            /* ---------------- FIND USER BOOKING ---------------- */
            const userBooking = bookings.find(
              (b) => String(b.ticketId) === String(t._id)
            );

            const bookedQty = userBooking?.quantity || 0;

            const totalValue = userBooking
              ? userBooking.totalPrice
              : t.price;


            return (
              <div
                key={t._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full">
                  {t.image?.trim() ? (
                    <img
                      src={t.image}
                      alt={t.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-3 left-3 text-white font-semibold">
                    {t.title}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-3">

                  {/* STATUS */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">
                      Booked Qty:{" "}
                      <span className="text-white">{bookedQty}</span>
                    </span>
                  </div>

                  {/* ROUTE */}
                  <p className="text-sm text-zinc-300">
                    {t.from} <span className="text-zinc-500">→</span> {t.to}
                  </p>

                  {/* PRICE */}
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Price: ৳{t.price}</span>
                    <span className="text-emerald-400 font-semibold">
                      Total: ৳{totalValue}
                    </span>
                  </div>

                  {/* COUNTDOWN */}
                  {t.status !== "rejected" && (
                    <div className="bg-zinc-800 p-2 rounded-lg text-center">
                      <Countdown date={departure} />
                    </div>
                  )}

                  {/* ---------------- ACTION LOGIC ---------------- */}

                  {/* NOT BOOKED */}
                  {!userBooking && t.status === "pending" && !isExpired && (
                    <button
                      onClick={() => bookTicket(t)}
                      className="w-full bg-indigo-600 py-2 rounded-xl"
                    >
                      Book Now
                    </button>
                  )}

                  {/* WAITING */}
                  {userBooking?.status === "pending" && (
                    <p className="text-yellow-400 text-center">
                      Waiting for Vendor Approval...
                    </p>
                  )}

                  {/* ACCEPTED → PAY NOW */}
                  {userBooking?.status === "accepted" && (
                    <button
                      onClick={() => handlePayment(userBooking)}
                      className="w-full rounded-xl bg-green-600 py-2"
                    >
                      Pay Now 💳
                    </button>
                  )}

                  {userBooking?.status === "paid" && (
                    <button
                      onClick={() =>
                        toast.success("You already paid for this ticket.")
                      }
                      className="w-full rounded-xl bg-blue-600 py-2"
                    >
                      Paid ✅
                    </button>
                  )}
                  {/* REJECTED */}
                  {userBooking?.status === "rejected" && (
                    <p className="text-red-500 text-center">
                      Booking Rejected
                    </p>
                  )}

                  {/* EXPIRED */}
                  {t.status === "pending" && isExpired && !userBooking && (
                    <p className="text-red-400 text-center">
                      Booking Closed (Expired)
                    </p>
                  )}

                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}