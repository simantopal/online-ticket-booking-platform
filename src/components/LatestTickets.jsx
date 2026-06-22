"use client";

import { getLatestTickets } from "@/lib/api/tickets";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LatestTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getLatestTickets();

        // ✅ ONLY APPROVED
        const approved = data.filter(
          (t) => t.status?.toLowerCase() === "approved"
        );

        setTickets(approved);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-zinc-950">
        <p className="text-center text-white">
          Loading latest tickets...
        </p>
      </section>
    );
  }

  return (
    <section className="bg-zinc-950 py-16">
      <div className="container mx-auto px-4">

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-white">
            Latest Tickets
          </h2>
          <p className="mt-2 text-zinc-400">
            Recently added travel tickets
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-indigo-500 transition"
              >
                <div className="relative h-52">
                  <Image
                    src={ticket.image}
                    alt={ticket.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute top-4 right-4 rounded-full bg-indigo-600 px-3 py-1 text-xs text-white">
                    {ticket.transportType}
                  </div>
                </div>

                <div className="p-5">

                  <h3 className="mb-3 text-lg font-bold text-white">
                    {ticket.title}
                  </h3>

                  <p className="mb-2 text-green-400 font-semibold">
                    ৳ {ticket.price} / unit
                  </p>

                  <p className="mb-4 text-sm text-zinc-400">
                    Available: {ticket.quantity}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {ticket.perks?.slice(0, 3).map((perk, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>

                  <Link href={`/tickets/${ticket._id}`}>
                    <button className="w-full rounded-xl bg-indigo-600 py-3 text-white hover:bg-indigo-500">
                      See Details
                    </button>
                  </Link>

                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-zinc-400">
              No approved latest tickets found
            </p>
          )}

        </div>
      </div>
    </section>
  );
}