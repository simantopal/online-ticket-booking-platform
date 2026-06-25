"use client";

import { useEffect, useState, useCallback } from "react";
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
    const email = session?.user?.email;

    const [data, setData] = useState({
        totalTicketsAdded: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRevenue = useCallback(async () => {
        if (!email) return;

        try {
            setError("");

            const res = await fetch(
                `http://localhost:5000/api/vendor/revenue?vendorEmail=${email}`,
                { cache: "no-store" }
            );

            if (!res.ok) throw new Error("Failed to load revenue data");

            const result = await res.json();

            setData({
                totalTicketsAdded: result?.totalTicketsAdded ?? 0,
                totalTicketsSold: result?.totalTicketsSold ?? 0,
                totalRevenue: result?.totalRevenue ?? 0,
            });
        } catch (err) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (!email) return;
        setLoading(true);
        loadRevenue();
    }, [email, loadRevenue]);

    useEffect(() => {
        if (!email) return;

        const interval = setInterval(() => {
            loadRevenue();
        }, 8000);

        return () => clearInterval(interval);
    }, [email, loadRevenue]);

    if (!email || loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const ticketData = [
        { metric: "Tickets Added", value: data.totalTicketsAdded },
        { metric: "Tickets Sold", value: data.totalTicketsSold },
    ];

    const revenueData = [
        { metric: "Total Revenue", value: data.totalRevenue },
    ];

    return (
        <div className="p-8 space-y-10 bg-background min-h-screen text-foreground">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">
                        Vendor Revenue Overview
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Track your tickets, sales & earnings in real time
                    </p>
                </div>

                <button
                    onClick={loadRevenue}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="p-6 rounded-2xl bg-[#111a2e]">
                    <p className="text-gray-400">Tickets Added</p>
                    <h3 className="text-3xl text-blue-400">
                        {data.totalTicketsAdded}
                    </h3>
                </div>

                <div className="p-6 rounded-2xl bg-[#111a2e]">
                    <p className="text-gray-400">Tickets Sold</p>
                    <h3 className="text-3xl text-purple-400">
                        {data.totalTicketsSold}
                    </h3>
                </div>

                <div className="p-6 rounded-2xl bg-[#111a2e]">
                    <p className="text-green-400">Total Revenue</p>
                    <h3 className="text-3xl text-green-400">
                        {data.totalRevenue} BDT
                    </h3>
                </div>

            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}