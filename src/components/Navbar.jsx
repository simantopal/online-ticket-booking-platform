"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars, Xmark, House, Ticket, Person, ArrowRightFromSquare, ChevronDown, Rectangles4,} from "@gravity-ui/icons";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";



export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isLoggedIn = !!user;

  if (isPending) {
    return (
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="text-white"><Spinner /></div>
        </div>
      </header>
    );
  }

  const dashboardLinks = {
    passenger: "/dashboard/passenger",
    vendor: "/dashboard/vendor",
    admin: "/dashboard/admin"
  };

  const navLinks = [
    { id: "home", icon: House, label: "Home", href: "/" },
    { id: "tickets", icon: Ticket, label: "All Tickets", href: "/tickets" },
    ...(isLoggedIn
      ? [
        {
          id: "dashboard",
          icon: Rectangles4,
          label: "Dashboard",
          href: dashboardLinks[user?.role || "passenger"],
        },
      ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Image
            src="/logo.png"
            alt="TicketBari Logo"
            width={150}
            height={100}
            className="h-15 w-auto object-contain"
          />
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 font-medium transition ${isActive ? "text-blue-500" : "text-zinc-300"
                  }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="rounded-xl px-4 py-2 text-violet-400 hover:bg-zinc-800 hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-xl bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 hover:bg-zinc-800"
              >
                <img
                  src={user?.image || "/avatar.png"}
                  className="h-8 w-8 rounded-full object-cover"
                />

                <span className="text-white">
                  {user?.name}
                </span>

                <ChevronDown className="size-4 text-zinc-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
                  <Link
                    href="/dashboard/vendor/profile"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Person className="size-4" />
                    My Profile
                  </Link>

                  <button
                    onClick={async () => {
                      await signOut();
                      router.refresh();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
                  >
                    <ArrowRightFromSquare className="size-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white"
        >
          {mobileOpen ? (
            <Xmark className="size-6" />
          ) : (
            <Bars className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="space-y-2 p-4">

            {navLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isActive ? "text-blue-500" : "text-zinc-300"
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
                  href="/auth/signin"
                  className="block rounded-xl border border-zinc-700 px-4 py-3 text-center"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={async () => {
                  await signOut();
                  router.refresh();
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
              >
                <ArrowRightFromSquare className="size-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}