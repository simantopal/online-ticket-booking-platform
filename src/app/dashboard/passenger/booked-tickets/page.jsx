"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

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


  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets`);
      const data = await res.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings?userEmail=${session.user.email}`
        );
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

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

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Booking Sent to Vendor");

      const refresh = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings?userEmail=${session.user.email}`
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout_sessions`, {
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
    <div className="p-6 bg-background min-h-screen text-foreground">
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
                className="bg-background border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
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
                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-foreground">
                      No Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-3 left-3 text-white font-semibold">
                    {t.title}
                  </div>
                </div>

                <div className="p-4 space-y-3">

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">
                      Booked Qty:{" "}
                      <span className="text-foreground">{bookedQty}</span>
                    </span>
                  </div>

                  <p className="text-sm text-foreground">
                    {t.from} <span className="text-zinc-500">→</span> {t.to}
                  </p>

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Price: ৳{t.price}</span>
                    <span className="text-emerald-400 font-semibold">
                      Total: ৳{totalValue}
                    </span>
                  </div>

                  {t.status !== "rejected" && (
                    <div className="bg-zinc-800 p-2 rounded-lg text-center">
                      <Countdown date={departure} />
                    </div>
                  )}


                  {!userBooking && t.status === "pending" && !isExpired && (
                    <button
                      onClick={() => bookTicket(t)}
                      className="w-full bg-indigo-600 py-2 rounded-xl"
                    >
                      Book Now
                    </button>
                  )}
                  {userBooking?.status === "pending" && (
                    <p className="text-yellow-400 text-center">
                      Waiting for Vendor Approval...
                    </p>
                  )}

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
                  {userBooking?.status === "rejected" && (
                    <p className="text-red-500 text-center">
                      Booking Rejected
                    </p>
                  )}

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