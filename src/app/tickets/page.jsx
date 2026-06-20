"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // navigation
  const handleClick = (id) => {
    if (isPending) return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    router.push(`/tickets/${id}`);
  };

  // loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">All Tickets</h1>
          <p className="mt-2 text-zinc-400">
            Browse admin-approved tickets
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-indigo-500 transition"
            >

              {/* Image */}
              <div className="relative h-56">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs">
                  {ticket.transportType}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">

                <h2 className="text-xl font-semibold mb-2">
                  {ticket.title}
                </h2>

                <p className="text-sm text-zinc-400 mb-4">
                  {ticket.from} → {ticket.to}
                </p>

                {/* details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Price</span>
                    <span className="text-green-400 font-medium">
                      ৳{ticket.price}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Available</span>
                    <span>{ticket.quantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Departure</span>
                    <span>{ticket.departureDateTime}</span>
                  </div>
                </div>

                {/* perks */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {ticket.perks?.map((perk) => (
                    <span
                      key={perk}
                      className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                    >
                      {perk}
                    </span>
                  ))}
                </div>

                {/* button */}
                <button
                  onClick={() => handleClick(ticket._id)}
                  className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-medium hover:bg-indigo-500"
                >
                  See Details
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}