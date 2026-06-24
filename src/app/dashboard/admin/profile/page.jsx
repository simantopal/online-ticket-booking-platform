"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();

  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const user = session?.user;

  const [form, setForm] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        Loading...
      </div>
    );
  }

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // update profile
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            image: form.image,
          }),
        }
      );

      const data = await res.json();

      if (data.modifiedCount > 0) {
        alert("Profile updated successfully");
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl my-6 md:my-10 px-4 md:px-0">

  {/* HEADER */}
  <div className="mb-5 md:mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-base-100">
      My Profile
    </h1>
    <p className="mt-1 text-sm md:text-base text-zinc-400">
      Manage your account information.
    </p>
  </div>

  {/* CARD */}
  <div className="container mx-auto overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-800 bg-background text-foreground">

    <div className="h-28 md:h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />

    <div className="relative px-4 md:px-8 pb-6 md:pb-8">

      {/* Avatar */}
      <div className="-mt-12 md:-mt-16">
        <img
          src={user?.image || "/avatar.png"}
          alt={user?.name}
          className="h-[90px] w-[90px] md:h-[120px] md:w-[120px] rounded-full border-4 border-zinc-900 object-cover"
        />
      </div>

      {/* Name */}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 md:mt-4">
        {user?.name}
      </h2>

      {/* Role */}
      <span className="inline-block mt-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs md:text-sm text-indigo-400">
        {user?.role || "Vendor"}
      </span>

      {/* DETAILS */}
      <div className="mt-6 md:mt-8 grid gap-3 md:gap-4 md:grid-cols-2">

        <div className="p-4 md:p-5 rounded-2xl border border-zinc-800 bg-background">
          <p className="text-xs md:text-sm text-zinc-400">Name</p>
          <p className="text-foreground font-medium">{user?.name}</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl border border-zinc-800 bg-background">
          <p className="text-xs md:text-sm text-zinc-400">Email</p>
          <p className="text-foreground font-medium break-all">{user?.email}</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl border border-zinc-800 bg-background">
          <p className="text-xs md:text-sm text-zinc-400">Role</p>
          <p className="text-foreground font-medium">{user?.role}</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl border border-zinc-800 bg-background">
          <p className="text-xs md:text-sm text-zinc-400">User ID</p>
          <p className="text-foreground truncate">{user?.id}</p>
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="mt-6 md:mt-8 w-full md:w-auto rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
      >
        Edit Profile
      </button>

    </div>
  </div>

  {/* MODAL */}
  {open && (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60">

      <div className="w-full md:max-w-md rounded-t-2xl md:rounded-2xl bg-zinc-900 border border-zinc-700 p-4 md:p-6">

        <h2 className="text-lg md:text-xl font-bold text-white mb-4">
          Edit Profile
        </h2>

        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 rounded-xl border border-zinc-700 bg-zinc-950 p-2 md:p-3 text-white"
          placeholder="Name"
        />

        {/* IMAGE */}
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full mb-3 rounded-xl border border-zinc-700 bg-zinc-950 p-2 md:p-3 text-white"
          placeholder="Image URL"
        />

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">

          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl bg-zinc-700 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex-1 rounded-xl bg-indigo-600 py-2 text-white hover:bg-indigo-500"
          >
            {updating ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  )}
</div>
  );
};

export default ProfilePage;