"use client";

import { useEffect, useState } from "react";
import { Chip } from "@heroui/react";

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
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch("http://localhost:5000/api/tickets");
      const data = await res.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

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

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-white">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        All Tickets
      </h1>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((t) => {
          const departure = new Date(t.departureDateTime);
          const isExpired = Date.now() > departure.getTime();

          const totalValue = t.price * t.quantity;

          return (
            <div
              key={t._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="relative h-48 w-full">
                <img
                  src={t.image}
                  alt={t.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-3 left-3 text-white font-semibold">
                  {t.title}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                {/* STATUS */}
                <div className="flex justify-between items-center">
                  <Chip color={getStatusColor(t.status)} variant="flat">
                    {t.status}
                  </Chip>

                  <span className="text-sm text-zinc-400">
                    Qty: <span className="text-white">{t.quantity}</span>
                  </span>
                </div>

                {/* ROUTE */}
                <p className="text-sm text-zinc-300">
                  {t.from} <span className="text-zinc-500">→</span> {t.to}
                </p>

                {/* PRICE */}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Price: ৳{t.price}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    Total: ৳{totalValue}
                  </span>
                </div>

                {/* TRANSPORT */}
                <p className="text-xs text-zinc-500">
                  Transport: {t.transportType}
                </p>

                {/* DEPARTURE */}
                <p className="text-xs text-zinc-500">
                  Departure: {new Date(t.departureDateTime).toLocaleString()}
                </p>

                {/* COUNTDOWN */}
                {t.status !== "rejected" && (
                  <div className="bg-zinc-800 border border-zinc-700 p-2 rounded-lg text-center">
                    <Countdown date={departure} />
                  </div>
                )}

                {/* ACTION */}
                {t.status === "pending" && !isExpired && (
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl">
                    Book Now
                  </button>
                )}

                {t.status === "pending" && isExpired && (
                  <p className="text-red-400 text-sm text-center">
                    Booking Closed (Expired)
                  </p>
                )}

                {t.status === "approved" && (
                  <p className="text-emerald-400 text-sm text-center">
                    Approved Ticket
                  </p>
                )}

                {t.status === "rejected" && (
                  <p className="text-red-400 text-sm text-center">
                    Rejected Ticket
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