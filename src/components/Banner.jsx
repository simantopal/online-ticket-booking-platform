"use client";

import { Magnifier, Ticket, Calendar, ArrowRight } from "@gravity-ui/icons";

export default function Banner() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/banner.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-zinc-950/80" />
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 text-center justify-center lg:justify-start lg:text-start">
          
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-400">
              <Ticket className="size-4" />
              Trusted Ticket Booking Platform
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Book Your Next Journey
              <span className="block text-indigo-500">
                In Seconds
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              Compare and book bus, train, launch and flight tickets
              across Bangladesh. Fast, secure and hassle-free booking.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center lg:justify-start lg:text-start">
              <button className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Book Tickets
              </button>

              <button className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white">
                Explore Routes
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8 lg:justify-start lg:text-start justify-center items-center">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  50K+
                </h3>
                <p className="text-zinc-500">
                  Happy Travelers
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">
                  100+
                </h3>
                <p className="text-zinc-500">
                  Routes Available
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">
                  24/7
                </h3>
                <p className="text-zinc-500">
                  Customer Support
                </p>
              </div>
            </div>
          </div>

          {/* Right Search Card */}
          <div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
              <h3 className="mb-6 text-2xl font-bold text-white">
                Search Tickets
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="From"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  placeholder="To"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    type="date"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                  <Magnifier className="size-4" />
                  Search Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
