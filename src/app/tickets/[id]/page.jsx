"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TicketDetailsPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tickets/${id}`)
      .then((res) => res.json())
      .then(setTicket);
  }, [id]);

  if (!ticket)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading...
      </div>
    );

  const isExpired =
    new Date(ticket.departureDateTime) < new Date();

  const isSoldOut = ticket.quantity === 0;

  const disabled = isExpired || isSoldOut;

  const diff = new Date(ticket.departureDateTime) - new Date();

  const countdown = diff > 0
    ? {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    : null;

  const handleBooking = async () => {
    if (qty < 1 || qty > ticket.quantity) return;

    await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: ticket._id,
        quantity: qty,
        status: "pending",
      }),
    });

    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="relative h-full min-h-[500px]">
          <img
            src={ticket.image}
            className="h-full w-full object-cover"
          />

          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs">
            {ticket.transportType}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="p-8 text-black">

          {/* TITLE */}
          <h1 className="text-2xl font-bold">
            {ticket.title}
          </h1>

          <p className="text-gray-500 mt-1">
            {ticket.from} → {ticket.to}
          </p>

          {/* COUNTDOWN */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Departure Countdown
            </p>

            {countdown && !isExpired ? (
              <div className="text-green-600 font-bold text-lg">
                {countdown.days}d {countdown.hours}h{" "}
                {countdown.minutes}m {countdown.seconds}s
              </div>
            ) : (
              <p className="text-red-500 font-semibold">
                Expired
              </p>
            )}
          </div>

          {/* INFO GRID */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold">৳{ticket.price}</p>
            </div>

            <div>
              <p className="text-gray-500">Available Tickets</p>
              <p className="font-semibold">{ticket.quantity}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-500">Departure Date</p>
              <p className="font-semibold">
                {ticket.departureDateTime}
              </p>
            </div>
          </div>

          {/* PERKS */}
          <div className="mt-6">
            <p className="text-gray-500 mb-2">Included Perks</p>
            <ul className="list-disc pl-5 text-sm">
              {ticket.perks?.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          {/* BOOK BUTTON */}
          <button
            disabled={disabled}
            onClick={() => setOpen(true)}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-white ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-600"
            }`}
          >
            {isExpired
              ? "Trip Expired"
              : isSoldOut
              ? "Sold Out"
              : "Book Now"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl w-[320px]">

            <h2 className="text-lg font-bold mb-3">
              Book Ticket
            </h2>

            <input
              type="number"
              min={1}
              max={ticket.quantity}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="w-1/2 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                className="w-1/2 bg-blue-600 text-white py-2 rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}