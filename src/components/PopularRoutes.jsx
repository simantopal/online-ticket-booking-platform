export function PopularRoutes() {
  const routes = [
    { from: "Dhaka", to: "Cox's Bazar", price: 1500, tag: "Beach" },
    { from: "Dhaka", to: "Chittagong", price: 800, tag: "City" },
    { from: "Dhaka", to: "Sylhet", price: 1200, tag: "Nature" },
    { from: "Dhaka", to: "Rajshahi", price: 1000, tag: "Heritage" },
  ];

  return (
    <section className="py-16 px-4 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        
          <div className="items-center text-center justify-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Popular Routes
            </h2>
            <p className="text-gray-500 mt-2">
              Explore the most booked travel destinations
            </p>
          </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border bg-gray-900 p-6 shadow-sm
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-100 to-transparent" />

              <span className="relative inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                {route.tag}
              </span>

              <div className="relative mt-4">
                <p className="text-xs text-white">From</p>
                <h3 className="font-semibold text-lg text-white">{route.from}</h3>

                <div className="my-3 flex items-center gap-2 text-white text-sm">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span>→</span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <p className="text-xs text-white">To</p>
                <h3 className="font-semibold text-lg text-white">{route.to}</h3>
              </div>

              <div className="relative mt-5 flex items-center justify-between">
                <p className="text-blue-600 font-bold text-lg">
                  ৳{route.price}
                </p>

                <button className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}