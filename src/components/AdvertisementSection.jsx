"use client";

import Image from "next/image";

const tickets = [
  {
    id: 1,
    title: "Dhaka → Chittagong Express",
    price: 1200,
    quantity: 1,
    transport: "Bus",
    perks: ["AC", "WiFi", "Water Bottle"],
    image: "/tickets/bus1.jpg",
  },
  {
    id: 2,
    title: "Dhaka → Sylhet Premium",
    price: 1500,
    quantity: 1,
    transport: "Bus",
    perks: ["Luxury Seat", "Snacks", "Charging Port"],
    image: "/tickets/bus2.jpg",
  },
  {
    id: 3,
    title: "Dhaka → Cox’s Bazar",
    price: 1800,
    quantity: 1,
    transport: "Bus",
    perks: ["Sleeper Seat", "Blanket", "AC"],
    image: "/tickets/bus3.jpg",
  },
  {
    id: 4,
    title: "Dhaka → Rajshahi Fast Trip",
    price: 1000,
    quantity: 1,
    transport: "Train",
    perks: ["Chair Coach", "Food Included"],
    image: "/tickets/train1.jpg",
  },
  {
    id: 5,
    title: "Dhaka → Khulna Express",
    price: 1100,
    quantity: 1,
    transport: "Train",
    perks: ["AC Cabin", "Tea Service"],
    image: "/tickets/train2.jpg",
  },
  {
    id: 6,
    title: "Dhaka City Premium Ride",
    price: 300,
    quantity: 1,
    transport: "CNG / Ride",
    perks: ["Fast Pickup", "AC", "Safe Ride"],
    image: "/tickets/ride1.jpg",
  },
];

export default function AdvertisementSection() {
  return (
    <section className="py-10 px-4 bg-gray-950">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Featured Tickets
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:scale-[1.02] transition"
          >
            <div className="relative h-40 w-full">
              <Image
                src={ticket.image}
                alt={ticket.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 text-white space-y-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>

              <p className="text-sm text-zinc-400">
                Transport: {ticket.transport}
              </p>

              <p className="text-sm text-zinc-300">
                Quantity: {ticket.quantity}
              </p>

              <p className="text-indigo-400 font-bold">
                ৳ {ticket.price} / unit
              </p>

              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((perk, i) => (
                  <span
                    key={i}
                    className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-300"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl transition">
                See details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}