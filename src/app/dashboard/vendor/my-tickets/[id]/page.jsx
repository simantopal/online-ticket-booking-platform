"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function UpdateTicketPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    quantity: "",
    departureDateTime: "",
    perks: "",
    image: "",
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/api/tickets/${id}`);
      const data = await res.json();

      setForm({
        title: data.title || "",
        from: data.from || "",
        to: data.to || "",
        transportType: data.transportType || "",
        price: data.price || "",
        quantity: data.quantity || "",
        departureDateTime: data.departureDateTime || "",
        perks: data.perks || "",
        image: data.image || "",
      });

      setLoading(false);
    };

    if (id) load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const res = await fetch(`${baseUrl}/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setUpdating(false);

    if (data.modifiedCount > 0) {
      alert("Ticket Updated Successfully");
      router.push("/dashboard/vendor/my-tickets");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-zinc-400">
        Loading ticket...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">

        {/* Header */}
        <div className="border-b border-zinc-800 p-6">
          <h1 className="text-2xl font-bold text-white">
            Update Ticket
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Edit ticket details and save changes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ticket Title"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="transportType"
              value={form.transportType}
              onChange={handleChange}
              placeholder="Transport Type"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              placeholder="From Location"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              placeholder="To Location"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              name="departureDateTime"
              value={form.departureDateTime}
              onChange={handleChange}
              placeholder="Departure Date & Time"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500 md:col-span-2"
            />

            <input
              name="perks"
              value={form.perks}
              onChange={handleChange}
              placeholder="Perks (AC, Food, etc)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500 md:col-span-2"
            />

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500 md:col-span-2"
            />
          </div>

          {/* Button */}
          <button
            disabled={updating}
            className={`w-full rounded-xl py-3 font-semibold transition ${
              updating
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white`}
          >
            {updating ? "Updating..." : "Update Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}