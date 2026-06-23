"use client";

import { useEffect, useState } from "react";

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets`
        );
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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.modifiedCount > 0) {
        setTickets((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status } : t))
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();

    if (s === "approved")
      return "bg-green-500/20 text-green-400";

    if (s === "rejected")
      return "bg-red-500/20 text-red-400";

    return "bg-yellow-500/20 text-yellow-400";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-white">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Manage Tickets
      </h1>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-zinc-900 text-left">
              <th className="p-4">Title</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Route</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr
                key={t._id}
                className="border-t border-zinc-800"
              >
                <td className="p-4">{t.title}</td>

                <td className="p-4 break-all">
                  {t.vendorEmail}
                </td>

                <td className="p-4">
                  {t.from} → {t.to}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                      t.status
                    )}`}
                  >
                    {t.status || "pending"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateStatus(t._id, "approved")
                      }
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(t._id, "rejected")
                      }
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {tickets.map((t) => (
          <div
            key={t._id}
            className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50"
          >
            <h3 className="font-semibold text-lg mb-3">
              {t.title}
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-zinc-400">
                  Vendor:
                </span>{" "}
                <span className="break-all">
                  {t.vendorEmail}
                </span>
              </p>

              <p>
                <span className="text-zinc-400">
                  Route:
                </span>{" "}
                {t.from} → {t.to}
              </p>

              <div>
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                    t.status
                  )}`}
                >
                  {t.status || "pending"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  updateStatus(t._id, "approved")
                }
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  updateStatus(t._id, "rejected")
                }
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}