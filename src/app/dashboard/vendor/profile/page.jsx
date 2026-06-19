"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Envelope, Person, Shield } from "@gravity-ui/icons";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading...
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="mx-auto max-w-5xl my-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          My Profile
        </h1>
        <p className="mt-1 text-zinc-400">
          Manage your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />

        <div className="relative px-8 pb-8">
          {/* Avatar */}
          <div className="-mt-16">
            <Image
              src={user?.image || "/avatar.png"}
              alt={user?.name || "Profile"}
              width={120}
              height={120}
              className="rounded-full border-4 border-zinc-900 object-cover"
            />
          </div>

          {/* Name */}
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">
              {user?.name}
            </h2>

            <span className="mt-2 inline-flex rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-400">
              {user?.role || "Vendor"}
            </span>
          </div>

          {/* Details */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="mb-2 flex items-center gap-2 text-zinc-400">
                <Person className="h-4 w-4" />
                <span>Full Name</span>
              </div>

              <p className="text-lg font-medium text-white">
                {user?.name}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="mb-2 flex items-center gap-2 text-zinc-400">
                <Envelope className="h-4 w-4" />
                <span>Email Address</span>
              </div>

              <p className="break-all text-lg font-medium text-white">
                {user?.email}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="mb-2 flex items-center gap-2 text-zinc-400">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </div>

              <p className="text-lg font-medium text-white">
                {user?.role || "Vendor"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="mb-2 flex items-center gap-2 text-zinc-400">
                <span>🆔</span>
                <span>User ID</span>
              </div>

              <p className="truncate text-lg font-medium text-white">
                {user?.id}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;