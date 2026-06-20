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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setUpdating(false);

    if (data.modifiedCount > 0) {
      alert("Ticket Updated Successfully");
      router.push("/dashboard/vendor/my-tickets");
    }
  };

  if (loading)
    return (
      <div className="text-center text-zinc-400 mt-10">
        Loading...
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">
        Update Ticket
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="input"
        />

        <input
          name="from"
          value={form.from}
          onChange={handleChange}
          placeholder="From"
          className="input"
        />

        <input
          name="to"
          value={form.to}
          onChange={handleChange}
          placeholder="To"
          className="input"
        />

        <input
          name="transportType"
          value={form.transportType}
          onChange={handleChange}
          placeholder="Transport Type"
          className="input"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="input"
        />

        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="input"
        />

        <input
          name="departureDateTime"
          value={form.departureDateTime}
          onChange={handleChange}
          placeholder="Departure Date Time"
          className="input"
        />

        <input
          name="perks"
          value={form.perks}
          onChange={handleChange}
          placeholder="Perks (AC, Food...)"
          className="input"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="input"
        />

        <button
          disabled={updating}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          {updating ? "Updating..." : "Update Ticket"}
        </button>
      </form>
    </div>
  );
}