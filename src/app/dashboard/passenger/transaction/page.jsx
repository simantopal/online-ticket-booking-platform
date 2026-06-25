"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Table } from "@heroui/react";

export default function TransactionPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchTransactions = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings?userEmail=${session.user.email}`
      );

      const data = await res.json();

      setTransactions(
        data.filter((item) => item.status === "paid")
      );
    };

    fetchTransactions();
  }, [session?.user?.email]);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-6 text-3xl font-bold">
        Transaction History
      </h1>

      <Table
        aria-label="Transaction History"
        className="rounded-xl"
      >
        <Table.ScrollContainer className="max-h-[500px]">
          <Table.Content>
            <Table.Header>
              <Table.Column isRowHeader>
                Transaction ID
              </Table.Column>

              <Table.Column>
                Amount
              </Table.Column>

              <Table.Column>
                Ticket Title
              </Table.Column>

              <Table.Column>
                Payment Date
              </Table.Column>
            </Table.Header>

            <Table.Body
              emptyContent="No transactions found"
            >
              {transactions.map((item) => (
                <Table.Row key={item._id}>
                  <Table.Cell>
                    <span className="font-mono text-sm">
                      {item.transactionId}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-semibold text-green-400">
                      ৳{item.totalPrice}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    {item.ticketTitle}
                  </Table.Cell>

                  <Table.Cell>
                    {item.paymentDate
                      ? new Date(
                          item.paymentDate
                        ).toLocaleString()
                      : "-"}
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