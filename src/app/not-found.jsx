"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-8xl font-extrabold text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            Go Home
          </Link>

          <button
            onClick={() => router.back()}
            className="rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}