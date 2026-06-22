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
          prev.map((t) =>
            t._id === id ? { ...t, status } : t
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="text-white flex justify-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Manage Tickets
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-zinc-800">
          <thead>
            <tr className="bg-zinc-900 text-left">
              <th className="p-3">Title</th>
              <th>Vendor</th>
              <th>Route</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => {
              const status = t.status?.toLowerCase();

              return (
                <tr
                  key={t._id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-3">{t.title}</td>
                  <td>{t.vendorEmail}</td>
                  <td>
                    {t.from} → {t.to}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {t.status || "pending"}
                    </span>
                  </td>

                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() =>
                        updateStatus(t._id, "approved")
                      }
                      className="px-3 py-1 bg-green-600 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(t._id, "rejected")
                      }
                      className="px-3 py-1 bg-red-600 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}