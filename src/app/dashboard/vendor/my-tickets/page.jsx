"use client";

import Link from "next/link";
import { Pencil, TrashBin } from "@gravity-ui/icons";
import { getVendorTickets } from "@/lib/api/tickets";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function MyTicketsPage() {
  const { data: session, isPending } = useSession();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user;

  useEffect(() => {
    const loadTickets = async () => {
      if (!user?.email) return;

      setLoading(true);

      try {
        const data = await getVendorTickets(user.email);
        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user?.email]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete ticket");
    }
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/15 text-green-400 border-green-500/20";

      case "rejected":
        return "bg-red-500/15 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-lg text-foreground">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Added Tickets</h1>
        <p className="mt-2 text-foreground">
          Manage all tickets you have added.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">
            No Tickets Found
          </h2>
          <p className="mt-2 text-zinc-400">
            You have not added any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => {
            const status = ticket.status?.toLowerCase();
            const isRejected = status === "rejected";

            return (
              <div
                key={ticket._id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700"
              >
                {/* Image */}
                <div className="relative h-56">
                  {ticket.image ? (
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {ticket.title}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                        ticket.status
                      )}`}
                    >
                      {status
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "Pending"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Route:</span>{" "}
                      {ticket.from} → {ticket.to}
                    </p>

                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Transport:</span>{" "}
                      {ticket.transportType}
                    </p>

                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Price:</span> ৳
                      {ticket.price}
                    </p>

                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Quantity:</span>{" "}
                      {ticket.quantity}
                    </p>

                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Departure:</span>{" "}
                      {ticket.departureDateTime}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/dashboard/vendor/my-tickets/${ticket._id}`}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isRejected
                          ? "pointer-events-none cursor-not-allowed bg-zinc-800 text-zinc-500"
                          : "bg-blue-600 text-white hover:bg-blue-500"
                      }`}
                    >
                      <Pencil className="h-4 w-4" />
                      Update
                    </Link>

                    <button
                      onClick={() => handleDelete(ticket._id)}
                      disabled={isRejected}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isRejected
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                          : "bg-red-800 text-white hover:bg-red-700"
                      }`}
                    >
                      <TrashBin className="h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  {isRejected && (
                    <p className="mt-3 text-xs text-red-400">
                      This ticket was rejected by admin. Update and delete
                      actions are disabled.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}