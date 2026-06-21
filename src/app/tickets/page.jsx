"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getAllTickets } from "@/lib/api/tickets";
import TicketFilters from "@/components/TicketFilters";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    transportType: "",
    sort: "",
  });

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter + Sort
  const filteredTickets = [...tickets]
    .filter(
      (ticket) =>
        ticket.from
          ?.toLowerCase()
          .includes(filters.from.toLowerCase()) &&
        ticket.to
          ?.toLowerCase()
          .includes(filters.to.toLowerCase()) &&
        (!filters.transportType ||
          ticket.transportType === filters.transportType)
    )
    .sort((a, b) =>
      filters.sort === "asc"
        ? a.price - b.price
        : filters.sort === "desc"
        ? b.price - a.price
        : 0
    );

  // Navigation
  const handleClick = (id) => {
    if (isPending) return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    router.push(`/tickets/${id}`);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">All Tickets</h1>
          <p className="mt-2 text-zinc-400">
            Browse admin-approved tickets
          </p>
        </div>

        {/* Filters */}
        <TicketFilters
          filters={filters}
          setFilters={setFilters}
        />

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition hover:border-indigo-500"
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
                  <h2 className="mb-2 text-xl font-semibold">
                    {ticket.title}
                  </h2>

                  <p className="mb-4 text-sm text-zinc-400">
                    {ticket.from} → {ticket.to}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Price</span>
                      <span className="font-medium text-green-400">
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

                  {/* Perks */}
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

                  {/* Button */}
                  <button
                    onClick={() => handleClick(ticket._id)}
                    className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-medium transition hover:bg-indigo-500"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-zinc-800 p-10 text-center text-zinc-400">
              No tickets found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}