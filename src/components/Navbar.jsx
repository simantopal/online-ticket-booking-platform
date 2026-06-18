"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars, Xmark, House, Ticket, Rectangles4, Person, ArrowRightFromSquare, ChevronDown } from "@gravity-ui/icons";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();

  const isLoggedIn = false;

  const user = {
    name: "Simanto Paul",
    image: "https://i.pravatar.cc/150?img=12",
  };

  const navLinks = [
    {
      icon: House,
      label: "Home",
      href: "/",
    },
    {
      icon: Ticket,
      label: "All Tickets",
      href: "/tickets",
    },
    {
      icon: Rectangles4,
      label: "Dashboard",
      href: "/dashboard",
      private: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">

        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white"
        >
          <Image
            src="/logo.png"
            alt="TicketBari Logo"
            width={150}
            height={100}
            className="object-contain w-50"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            if (item.private && !isLoggedIn) return null;

            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 font-medium transition hover:text-white ${isActive ? "text-blue-500" : "text-zinc-300"
                  }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>


        <div className="hidden md:flex">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="rounded-xl px-4 py-2 font-medium text-violet-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-xl bg-violet-600 px-5 py-2 font-semibold text-white transition hover:bg-violet-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800"
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />

                <span className="font-medium text-white">
                  {user.name}
                </span>

                <ChevronDown className="size-4 text-zinc-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <Person className="size-4" />
                    My Profile
                  </Link>

                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10"
                    onClick={() => {
                      console.log("logout");
                    }}
                  >
                    <ArrowRightFromSquare className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
        >
          {mobileOpen ? (
            <Xmark className="size-6" />
          ) : (
            <Bars className="size-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="space-y-2 p-4">
            {isLoggedIn && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-white">
                    {user.name}
                  </h3>

                  <p className="text-sm text-zinc-400">
                    Welcome back
                  </p>
                </div>
              </div>
            )}

            {navLinks.map((item) => {
              if (item.private && !isLoggedIn) return null;

              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-zinc-800 hover:text-white ${isActive ? "text-blue-500" : "text-zinc-300"
                    }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}

            {!isLoggedIn ? (
              <div className="space-y-2 pt-3">
                <Link
                  href="/login"
                  className="block rounded-xl border border-zinc-700 px-4 py-3 text-center text-zinc-300"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  <Person className="size-4" />
                  My Profile
                </Link>

                <button
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10"
                >
                  <ArrowRightFromSquare className="size-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}