"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

const availablePerks = [
    "AC",
    "Breakfast",
    "WiFi",
    "Charging Port",
    "Window Seat",
    "Extra Luggage",
];

export default function AddTicketPage() {
    const { data: session, isPending } = useSession();

    const [selectedPerks, setSelectedPerks] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    if (isPending) {
        return (
            <div className="flex h-64 items-center justify-center">
                Loading...
            </div>
        );
    }

    const user = session?.user;

    const handlePerkChange = (perk) => {
        if (selectedPerks.includes(perk)) {
            setSelectedPerks(
                selectedPerks.filter((item) => item !== perk)
            );
        } else {
            setSelectedPerks([...selectedPerks, perk]);
        }
    };

    const handleImagePreview = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
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
            price: form.price.value,
            quantity: form.quantity.value,
            departureDateTime: form.departureDateTime.value,
            perks: selectedPerks,
            vendorName: user?.name,
            vendorEmail: user?.email,
        };

        console.log(ticketData);

        // TODO:
        // 1. Upload image to imgbb
        // 2. Get image URL
        // 3. Save ticket to database

        alert("Ticket data ready for submission!");
    };

    return (
        <div className="mx-auto max-w-5xl my-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Add Ticket
                </h1>
                <p className="mt-2 text-zinc-400">
                    Create a new ticket listing for customers.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
            >
                {/* Ticket Information */}
                <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Ticket Information
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Ticket Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Dhaka to Cox's Bazar"
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
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Transport Type
                            </label>

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

                {/* Pricing & Schedule */}
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

                {/* Perks */}
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

                {/* Image Upload */}
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

                {/* Vendor Information */}
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

                {/* Submit */}
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