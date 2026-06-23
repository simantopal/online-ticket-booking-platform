"use client";

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

  // =========================
  // ROLE UPDATE
  // =========================
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
      console.log("ROLE UPDATE:", data);

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

  // =========================
  // MARK FRAUD (FIXED)
  // =========================
  const markFraud = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to mark this vendor as fraud?"
    );

    if (!confirmAction) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },

          // 🔥 IMPORTANT FIX
          body: JSON.stringify({
            isFraud: true,
            role: "vendor",
          }),
        }
      );

      const data = await res.json();
      console.log("FRAUD RESPONSE:", data);

      if (data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id
              ? { ...u, isFraud: true }
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

      {/* ================= TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-zinc-800">
          <thead>
            <tr className="bg-zinc-900 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
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

                  <td className="p-3 break-all">
                    {user.email}
                  </td>

                  <td className="p-3">
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

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateRole(user._id, "admin")
                        }
                        disabled={user.role === "admin"}
                        className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
                      >
                        Make Admin
                      </button>

                      <button
                        onClick={() =>
                          updateRole(user._id, "vendor")
                        }
                        disabled={user.role === "vendor"}
                        className="px-3 py-1 bg-purple-600 rounded disabled:opacity-50"
                      >
                        Make Vendor
                      </button>

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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="grid gap-4 md:hidden">
        {users.map((user) => {
          const isVendor = user.role === "vendor";
          const isFraud = user.isFraud;

          return (
            <div
              key={user._id}
              className="border border-zinc-800 rounded-xl bg-zinc-900 p-4"
            >
              <h3 className="font-semibold text-lg">
                {user.name}
              </h3>

              <p className="text-sm text-zinc-400 break-all mt-1">
                {user.email}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
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
                  <span className="text-xs text-red-400">
                    Fraud Vendor
                  </span>
                )}
              </div>

              <div className="grid gap-2 mt-4">
                <button
                  onClick={() =>
                    updateRole(user._id, "admin")
                  }
                  disabled={user.role === "admin"}
                  className="w-full px-3 py-2 bg-blue-600 rounded disabled:opacity-50"
                >
                  Make Admin
                </button>

                <button
                  onClick={() =>
                    updateRole(user._id, "vendor")
                  }
                  disabled={user.role === "vendor"}
                  className="w-full px-3 py-2 bg-purple-600 rounded disabled:opacity-50"
                >
                  Make Vendor
                </button>

                {isVendor && (
                  <button
                    onClick={() => markFraud(user._id)}
                    disabled={isFraud}
                    className={`w-full px-3 py-2 rounded ${
                      isFraud
                        ? "bg-red-900/40 text-red-400"
                        : "bg-red-600"
                    }`}
                  >
                    Mark Fraud
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}