"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { addTicket } from "@/lib/actions/tickets";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";

const availablePerks = [ "AC", "Breakfast", "WiFi",  "Charging Port", "Window Seat", "Extra Luggage",];

export default function AddTicketPage() {
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [selectedPerks, setSelectedPerks] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`)
                .then((res) => res.json())
                .then((data) => {
                    const foundUser = data.find(
                        (u) => u.email === user.email
                    );
                    setCurrentUser(foundUser);
                });
        }
    }, [user]);

    if (isPending) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const handlePerkChange = (perk) => {
        if (selectedPerks.includes(perk)) {
            setSelectedPerks(
                selectedPerks.filter((item) => item !== perk)
            );
        } else {
            setSelectedPerks([...selectedPerks, perk]);
        }
    };

    const handleImagePreview = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();

            if (data.success) {
                setImageUrl(data.data.url);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const ticketData = {
            title: form.title.value,
            from: form.from.value,
            to: form.to.value,
            transportType: form.transportType.value,
            price: Number(form.price.value),
            quantity: Number(form.quantity.value),
            departureDateTime: form.departureDateTime.value,
            perks: selectedPerks,
            image: imageUrl,
            vendorName: user?.name,
            vendorEmail: user?.email,
            status: "Pending",
            createdAt: new Date(),
        };
        const res = await addTicket(ticketData);
        if (res.insertedId) {
            toast.success("Ticket Add successfully");
            e.target.reset();
            window.location.reload();
        }
    };

    if (currentUser?.isFraud) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500">Fraud Vendor</h2>
                    <p className="mt-3 text-zinc-300">Your account has been marked as fraud.</p>
                    <p className="mt-2 text-zinc-400">Fraud vendors are not allowed to add tickets.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl my-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Add Ticket</h1>
                <p className="mt-2 text-zinc-400">Create a new ticket listing for customers.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
            >
                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">Ticket Information</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Ticket Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Dhaka Express"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    From (Location)
                                </label>
                                <input
                                    type="text"
                                    name="from"
                                    required
                                    placeholder="Dhaka"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    To (Location)
                                </label>

                                <input
                                    type="text"
                                    name="to"
                                    required
                                    placeholder="Cox's Bazar"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Transport Type</label>

                            <select
                                name="transportType"
                                required
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                            >
                                <option value="">Select Transport</option>
                                <option value="Bus">Bus</option>
                                <option value="Train">Train</option>
                                <option value="Flight">Flight</option>
                                <option value="Launch">Launch</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Pricing & Schedule
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Price (Per Unit)
                            </label>

                            <input
                                type="number"
                                name="price"
                                required
                                min="1"
                                placeholder="1200"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Ticket Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                required
                                min="1"
                                placeholder="50"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Departure Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            name="departureDateTime"
                            required
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Ticket Perks
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availablePerks.map((perk) => (
                            <label
                                key={perk}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-4 transition hover:border-indigo-500"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPerks.includes(perk)}
                                    onChange={() => handlePerkChange(perk)}
                                />

                                <span className="text-zinc-200">
                                    {perk}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Ticket Image
                    </h2>

                    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-6">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagePreview}
                            className="w-full text-zinc-400"
                        />

                        {uploading && (
                            <p className="mt-3 text-sm text-blue-400">
                                Uploading image...
                            </p>
                        )}

                        {imagePreview && (
                            <div className="mt-5">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={500}
                                    height={300}
                                    className="h-64 w-full rounded-xl object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Vendor Information
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Vendor Name
                            </label>

                            <input
                                type="text"
                                readOnly
                                value={user?.name || ""}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Vendor Email
                            </label>

                            <input
                                type="email"
                                readOnly
                                value={user?.email || ""}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-500"
                >
                    Add Ticket
                </button>
            </form>
        </div>
    );
}