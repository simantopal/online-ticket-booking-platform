"use client";

import { useEffect, useState } from "react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
        );
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
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
      console.log(data);

      if (data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role } : u
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // MARK FRAUD
  const markFraud = async (id) => {
    const confirm = window.confirm(
      "Are you sure to mark this vendor as fraud?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      if (data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, isFraud: true } : u
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-10">Loading users...</div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-zinc-800">
          <thead>
            <tr className="bg-zinc-900 text-left">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isVendor = user.role === "vendor";
              const isFraud = user.isFraud;

              return (
                <tr
                  key={user._id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-3">{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.role === "admin"
                          ? "bg-blue-500/20 text-blue-400"
                          : user.role === "vendor"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>

                    {isFraud && (
                      <span className="ml-2 text-xs text-red-400">
                        (Fraud)
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2 flex-wrap">
                    {/* Make Admin */}
                    <button
                      onClick={() =>
                        updateRole(user._id, "admin")
                      }
                      disabled={user.role === "admin"}
                      className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
                    >
                      Make Admin
                    </button>

                    {/* Make Vendor */}
                    <button
                      onClick={() =>
                        updateRole(user._id, "vendor")
                      }
                      disabled={user.role === "vendor"}
                      className="px-3 py-1 bg-purple-600 rounded disabled:opacity-50"
                    >
                      Make Vendor
                    </button>

                    {/* Fraud Button (only vendor) */}
                    {isVendor && (
                      <button
                        onClick={() => markFraud(user._id)}
                        disabled={isFraud}
                        className={`px-3 py-1 rounded ${
                          isFraud
                            ? "bg-red-900/40 text-red-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-500"
                        }`}
                      >
                        Mark Fraud
                      </button>
                    )}
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