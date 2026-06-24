"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";
import { Spinner } from "@heroui/react";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [ticket, setTicket] = useState(null);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(true);

  const [countdown, setCountdown] = useState(null);

  // AUTH CHECK
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      try {
        setLoadingTicket(true);

        const res = await fetch(
          `http://localhost:5000/api/tickets/${id}`
        );
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingTicket(false);
      }
    };
    fetchTicket();
  }, [id]);

  // COUNTDOWN
  useEffect(() => {
    if (!ticket?.departureDateTime) return;

    const target = new Date(ticket.departureDateTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown(null);
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  if (isPending || loadingTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
        <Spinner />
      </div>
    );
  }

  if (!session || !ticket) return null;

  const isExpired =
    new Date(ticket.departureDateTime) < new Date();
  const isSoldOut = ticket.quantity === 0;
  const disabled = isExpired || isSoldOut;

  const handleBooking = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket._id,
          ticketTitle: ticket.title,
          quantity: qty,
          unitPrice: ticket.price,
          totalPrice: ticket.price * qty,
          userEmail: session.user.email,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Booking failed");
        return;
      }

      setTicket((prev) => ({
        ...prev,
        quantity: result.remainingTickets,
      }));

      setOpen(false);
      setQty(1);

      alert("Booking successful!");
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const handleOpenBooking = () => {
    if (session?.user?.role !== "passenger") {
      alert("Only passengers can book tickets");
      return;
    }
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl bg-white/80 grid md:grid-cols-2">

        <div className="relative min-h-125">
          <Image
            src={ticket.image}
            alt={ticket.title}
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1280px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />

          <div className="absolute left-4 top-4 rounded-full bg-blue-600/90 px-4 py-1 text-xs text-white backdrop-blur">
            {ticket.transportType}
          </div>
        </div>

        <div className="p-8 text-black">
          <h1 className="text-3xl font-bold">
            {ticket.title}
          </h1>
          <p className="mt-2 text-gray-600">
            {ticket.from} → {ticket.to}
          </p>

          <div className="mt-6 p-4 rounded-xl bg-gray-100 border">
            <p className="text-sm text-gray-500 mb-2">
              Departure Countdown
            </p>

            {countdown ? (
              <div className="text-green-600 font-bold">
                {countdown.days}d {countdown.hours}h{" "}
                {countdown.minutes}m {countdown.seconds}s
              </div>
            ) : (
              <p className="text-red-500 font-semibold">
                Expired
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-100 border rounded-xl">
              <p className="text-gray-500">Price</p>
              <p className="font-semibold">৳{ticket.price}</p>
            </div>

            <div className="p-3 bg-gray-100 border rounded-xl">
              <p className="text-gray-500">Available Tickets</p>
              <p className="font-semibold">{ticket.quantity}</p>
            </div>

            <div className="col-span-2 p-3 bg-gray-100 border rounded-xl">
              <p className="text-gray-500">Departure</p>
              <p className="font-semibold">
                {ticket.departureDateTime}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-600 font-medium mb-2">
              Included Perks
            </p>
            <div className="flex flex-wrap gap-2">
              {ticket.perks?.map((perk) => (
                <span
                  key={perk}
                  className="px-3 py-1 text-xs bg-gray-200 border rounded-full"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>
          <button
            disabled={disabled}
            onClick={handleOpenBooking}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition ${disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-600 hover:scale-[1.02]"
              }`}
          >
            {disabled
              ? isExpired
                ? "Trip Expired"
                : "Sold Out"
              : "Book Now"}
          </button>
        </div>
      </div>

      {open && (
        <BookingModal
          open={open}
          setOpen={setOpen}
          ticket={ticket}
          qty={qty}
          setQty={setQty}
          handleBooking={handleBooking}
        />
      )}
    </div>
  );
}