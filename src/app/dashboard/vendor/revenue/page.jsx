"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function RevenuePage() {
    const { data: session } = useSession();

    const [data, setData] = useState({
        totalTicketsAdded: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!session?.user?.email) return;

            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:5000/api/vendor/revenue?vendorEmail=${session.user.email}`
                );

                if (!res.ok) throw new Error("Failed to load revenue data");

                const result = await res.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [session?.user?.email]);

    // ---------------- LOADING SPINNER ----------------
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    // ---------------- DATA MAP ----------------
    const ticketData = [
        { metric: "Tickets Added", value: data.totalTicketsAdded },
        { metric: "Tickets Sold", value: data.totalTicketsSold },
    ];

    const revenueData = [
        { metric: "Total Revenue", value: data.totalRevenue },
    ];

    return (
        <div className="p-8 space-y-10 bg-zinc-950 min-h-screen text-white">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Vendor Revenue Overview
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Track your tickets, sales & earnings in real time
                    </p>
                </div>

                <div className="px-4 py-2 bg-[#111a2e] border border-gray-700 rounded-xl text-sm text-gray-300">
                    📊 Live Analytics
                </div>
            </div>

            {/* ---------------- STATS CARDS ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div className="p-6 rounded-2xl bg-[#111a2e] border border-gray-800 hover:border-blue-500 transition">
                    <p className="text-sm text-gray-400">Tickets Added</p>
                    <h3 className="text-3xl font-bold text-blue-400 mt-2">
                        {data.totalTicketsAdded}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Total tickets created by you
                    </p>
                </div>

                {/* Card 2 */}
                <div className="p-6 rounded-2xl bg-[#111a2e] border border-gray-800 hover:border-purple-500 transition">
                    <p className="text-sm text-gray-400">Tickets Sold</p>
                    <h3 className="text-3xl font-bold text-purple-400 mt-2">
                        {data.totalTicketsSold}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Successfully booked tickets
                    </p>
                </div>

                {/* Card 3 */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 shadow-lg">
                    <p className="text-sm text-green-300">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-green-400 mt-2">
                        {data.totalRevenue} BDT
                    </h3>
                    <p className="text-xs text-green-200/70 mt-1">
                        Earnings from paid bookings
                    </p>
                </div>
            </div>

            {/* ---------------- TICKETS CHART ---------------- */}
            <div className="p-6 rounded-2xl bg-[#111a2e] border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        Tickets Overview
                    </h3>
                    <span className="text-xs text-gray-400">This month</span>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="metric" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111a2e",
                                border: "1px solid #374151",
                                color: "#fff",
                            }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ---------------- REVENUE CHART ---------------- */}
            <div className="p-6 rounded-2xl bg-[#111a2e] border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        Revenue Overview
                    </h3>
                    <span className="text-xs text-gray-400">Live data</span>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="metric" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111a2e",
                                border: "1px solid #374151",
                                color: "#fff",
                            }}
                        />
                        <Bar dataKey="value" fill="#22c55e" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}