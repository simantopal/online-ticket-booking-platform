"use client";

import { Table } from "@heroui/react";
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
    <div className="container mx-auto">
      <h1 className="text-xl md:text-2xl font-bold my-6">
        Manage Tickets
      </h1>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Manage tickets table"
            className="border border-default-200 rounded-xl"
          >
            <Table.Header>
              <Table.Column isRowHeader >Title</Table.Column>
              <Table.Column>Vendor</Table.Column>
              <Table.Column>Route</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Action</Table.Column>
            </Table.Header>

            <Table.Body>
              {tickets.map((t) => (
                <Table.Row key={t._id}>
                  <Table.Cell>{t.title}</Table.Cell>

                  <Table.Cell>
                    <span className="break-all">
                      {t.vendorEmail}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    {t.from} → {t.to}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                        t.status
                      )}`}
                    >
                      {t.status || "pending"}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateStatus(t._id, "approved")
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(t._id, "rejected")
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}