"use client";

import { Table } from "@heroui/react";
import { useEffect, useState } from "react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
        );

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.log("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ROLE UPDATE
  const updateRole = async (id, role) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

      const data = await res.json();

      if (data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role } : u
          )
        );
      }
    } catch (err) {
      console.log("ROLE ERROR:", err);
    }
  };

  // MARK / UNDO FRAUD
  const toggleFraud = async (user) => {
    const makeFraud = !user.isFraud;

    const confirmAction = window.confirm(
      makeFraud
        ? "Are you sure you want to mark this vendor as fraud?"
        : "Are you sure you want to remove fraud status?"
    );

    if (!confirmAction) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isFraud: makeFraud,
          }),
        }
      );

      const data = await res.json();

      if (data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? { ...u, isFraud: makeFraud }
              : u
          )
        );
      }
    } catch (err) {
      console.log("FRAUD ERROR:", err);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="text-white p-10">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-white">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Manage Users
      </h1>

      {/* DESKTOP TABLE */}
      <div className="md:block">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Manage users table"
              className="border border-default-200 rounded-xl"
            >
              <Table.Header>
                <Table.Column isRowHeader >Name</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>

              <Table.Body>
                {users.map((user) => {
                  const isVendor = user.role === "vendor";
                  const isFraud = user.isFraud;

                  return (
                    <Table.Row key={user._id}>
                      <Table.Cell>{user.name}</Table.Cell>

                      <Table.Cell>
                        <span className="break-all">
                          {user.email}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${user.role === "admin"
                                ? "bg-blue-500/20 text-blue-500"
                                : user.role === "vendor"
                                  ? "bg-purple-500/20 text-purple-500"
                                  : "bg-gray-500/20 text-gray-500"
                              }`}
                          >
                            {user.role}
                          </span>

                          {isFraud && (
                            <span className="text-xs text-red-500">
                              Fraud
                            </span>
                          )}
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateRole(user._id, "admin")
                            }
                            disabled={user.role === "admin"}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                          >
                            Make Admin
                          </button>

                          <button
                            onClick={() =>
                              updateRole(user._id, "vendor")
                            }
                            disabled={user.role === "vendor"}
                            className="px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
                          >
                            Make Vendor
                          </button>

                          {isVendor && (
                            <button
                              onClick={() =>
                                toggleFraud(user)
                              }
                              className={`px-3 py-1 text-white rounded ${isFraud
                                  ? "bg-green-600 hover:bg-green-500"
                                  : "bg-red-600 hover:bg-red-500"
                                }`}
                            >
                              {isFraud
                                ? "Undo Fraud"
                                : "Mark Fraud"}
                            </button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}