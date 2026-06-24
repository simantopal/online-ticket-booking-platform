"use client";

import { getAdvertisements } from "@/lib/api/tickets";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdvertisementSection() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getAdvertisements();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Advertisement fetch error:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <section className="bg-zinc-950 py-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-white">
            Featured Tickets
          </h2>
          <p className="mt-2 text-zinc-400">
            Explore our handpicked top travel options
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-zinc-400">
            Loading advertisements...
          </div>
        )}

        {/* Empty state */}
        {!loading && tickets.length === 0 && (
          <div className="text-center text-zinc-500">
            No featured tickets available
          </div>
        )}

        {/* Cards */}
        {!loading && tickets.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500"
              >
                {/* Image */}
                <div className="relative h-56 bg-zinc-800">
                  <Image
                    src={ticket.image || "/placeholder.jpg"}
                    alt={ticket.title || "Ticket"}
                    fill
                    sizes="(max-width: 768px) 100vw,
                            (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />

                  <div className="absolute right-4 top-4 rounded-full bg-indigo-600 px-4 py-1 text-xs font-medium text-white">
                    {ticket.transportType || "N/A"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 text-white">
                  <h3 className="mb-4 text-2xl font-bold">
                    {ticket.title}
                  </h3>

                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-green-400">
                      ৳ {ticket.price} / Per tickets
                    </p>

                    <p className="text-zinc-300">
                      Available tickets: {ticket.quantity}
                    </p>
                  </div>

                  {/* Perks */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    {ticket?.perks?.length > 0 ? (
                      ticket.perks.map((perk, index) => (
                        <span
                          key={`${perk}-${index}`}
                          className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
                        >
                          ✓ {perk}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-500">
                        No perks available
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <Link href={`/tickets/${ticket._id}`}>
                    <button className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500">
                      See Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link href="/tickets">
            <button className="rounded-full border border-zinc-700 px-8 py-3 text-white transition hover:border-indigo-500 hover:bg-indigo-600">
              View All Tickets →
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}