"use client";

import { useEffect, useState } from "react";
import { Table } from "@heroui/react";
import { toast } from "react-toastify";
import { getApprovedTickets, toggleAdvertiseTicket} from "@/lib/api/tickets";

export default function AdvertiseTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getApprovedTickets();
      setTickets(res || []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

  const handleToggle = async (ticket) => {
    const willAdvertise = !ticket.isAdvertised;

    if (willAdvertise && advertisedCount >= 6) {
      toast.error("You can only advertise up to 6 tickets");
      return;
    }

    try {
      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticket._id
            ? { ...t, isAdvertised: willAdvertise }
            : t
        )
      );

      await toggleAdvertiseTicket(ticket._id, willAdvertise);

      toast.success(
        willAdvertise
          ? "Ticket advertised"
          : "Removed from advertisement"
      );
    } catch (err) {
      toast.error("Something went wrong");
      fetchTickets();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Advertise Tickets
        </h2>

        <span className={`px-3 py-1 rounded-full text-white ${
          advertisedCount >= 6 ? "bg-red-500" : "bg-blue-500"
        }`}>
          {advertisedCount}/6 Advertised
        </span>
      </div>

      {/* TABLE (NEW HEROUI STRUCTURE) */}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Advertise tickets table">

            {/* HEADER */}
            <Table.Header>
              <Table.Column isRowHeader>#</Table.Column>
              <Table.Column>Photo</Table.Column>
              <Table.Column>Name</Table.Column>
              <Table.Column>From</Table.Column>
              <Table.Column>To</Table.Column>
              <Table.Column>Type</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Quantity</Table.Column>
              <Table.Column>Action</Table.Column>
            </Table.Header>

            {/* BODY */}
            <Table.Body>
              {tickets.map((ticket, index) => {
                const disableToggle =
                  !ticket.isAdvertised && advertisedCount >= 6;

                return (
                  <Table.Row key={ticket._id}>

                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>
                      <img
                        src={ticket.image}
                        alt={ticket.title}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </Table.Cell>

                    <Table.Cell>{ticket.title}</Table.Cell>
                    <Table.Cell>{ticket.from}</Table.Cell>
                    <Table.Cell>{ticket.to}</Table.Cell>
                    <Table.Cell>{ticket.transportType}</Table.Cell>
                    <Table.Cell>৳ {ticket.price}</Table.Cell>
                    <Table.Cell>{ticket.quantity}</Table.Cell>

                    <Table.Cell>
                      {ticket.isAdvertised ? (
                        <button
                          onClick={() => handleToggle(ticket)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Unadvertise
                        </button>
                      ) : (
                        <button
                          disabled={disableToggle}
                          onClick={() => handleToggle(ticket)}
                          className={`px-3 py-1 rounded text-white ${
                            disableToggle
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          Advertise
                        </button>
                      )}
                    </Table.Cell>

                  </Table.Row>
                );
              })}
            </Table.Body>

          </Table.Content>
        </Table.ScrollContainer>
      </Table>

    </div>
  );
}