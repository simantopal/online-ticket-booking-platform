"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getAllTickets } from "@/lib/api/tickets";
import TicketFilters from "@/components/TicketFilters";
import Image from "next/image";
import { Spinner } from "@heroui/react";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    transportType: "",
    sort: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;

  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets();
        console.log(data);
        setTickets(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = [...tickets]
    .filter((ticket) => ticket.status === "approved")
    .filter(
      (ticket) =>
        ticket.from?.toLowerCase().includes(filters.from.toLowerCase()) &&
        ticket.to?.toLowerCase().includes(filters.to.toLowerCase()) &&
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredTickets.length / ticketsPerPage
  );

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;

  const paginatedTickets = filteredTickets.slice(
    startIndex,
    endIndex
  );

  const handleClick = (id) => {
    if (isPending) return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    router.push(`/tickets/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Spinner /> Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
       
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">All Tickets</h1>
          <p className="mt-2 text-default-500">
            Browse admin-approved tickets
          </p>
        </div>

        <TicketFilters
          filters={filters}
          setFilters={setFilters}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTickets.length > 0 ? (
            paginatedTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-background shadow-2xl transition hover:border-indigo-500"
              >
                <div className="relative h-56">
                  {ticket.image ? (
                    <Image
                      src={ticket.image}
                      alt={ticket.title}
                      fill
                      sizes="(max-width: 768px) 100vw,
                              (max-width: 1280px) 50vw, 33vw"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                      No Image
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs">
                    {ticket.transportType}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="mb-2 text-xl font-semibold">
                    {ticket.title}
                  </h2>

                  <p className="mb-4 text-sm text-foreground">
                    {ticket.from} → {ticket.to}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Price</span>
                      <span className="font-medium text-green-400">
                        ৳{ticket.price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Available Tickets
                      </span>
                      <span>{ticket.quantity}</span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-foreground">
                        Departure
                      </span>
                      <span className="text-right text-xs">
                        {ticket.departureDateTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {ticket.perks?.map((perk) => (
                      <span
                        key={perk}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-foreground"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => handleClick(ticket._id)}
                      className="w-full rounded-xl bg-indigo-600 py-3 font-medium transition hover:bg-indigo-500"
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-zinc-800 p-10 text-center text-zinc-400">
              No tickets found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-xl px-4 py-2 text-sm transition ${currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "border border-zinc-700 hover:border-indigo-500"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}