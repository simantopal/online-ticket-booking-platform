export default function AllTicketsPage() {
  const tickets = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      title: "Dhaka to Cox's Bazar",
      from: "Dhaka",
      to: "Cox's Bazar",
      transport: "Bus",
      price: 1200,
      quantity: 15,
      departure: "25 June 2026 • 10:00 PM",
      perks: ["AC", "WiFi", "Snacks"],
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
      title: "Dhaka to Sylhet",
      from: "Dhaka",
      to: "Sylhet",
      transport: "Train",
      price: 800,
      quantity: 8,
      departure: "28 June 2026 • 08:00 AM",
      perks: ["AC Cabin", "Charging Port"],
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
      title: "Dhaka to Chattogram",
      from: "Dhaka",
      to: "Chattogram",
      transport: "Flight",
      price: 5500,
      quantity: 5,
      departure: "30 June 2026 • 04:30 PM",
      perks: ["Meal", "20kg Luggage", "Priority Boarding"],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">All Tickets</h1>
          <p className="mt-2 text-zinc-400">
            Browse all available tickets approved by admin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium">
                  {ticket.transport}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="mb-2 text-xl font-semibold">
                  {ticket.title}
                </h2>

                <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
                  <span>{ticket.from}</span>
                  <span>→</span>
                  <span>{ticket.to}</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Price
                    </span>
                    <span className="font-medium text-green-400">
                      ৳{ticket.price}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Available
                    </span>
                    <span>{ticket.quantity} Tickets</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Departure
                    </span>
                    <span className="text-right">
                      {ticket.departure}
                    </span>
                  </div>
                </div>

                {/* Perks */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {ticket.perks.map((perk) => (
                    <span
                      key={perk}
                      className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                    >
                      {perk}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium transition hover:bg-indigo-500">
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}