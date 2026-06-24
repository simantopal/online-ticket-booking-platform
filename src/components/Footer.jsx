"use client";

import Link from "next/link";
import { Ticket, Envelope, Handset, LogoFacebook } from "@gravity-ui/icons";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">

                    <div className="flex flex-col items-center md:items-start">
                        <Link
                            href="/"
                            className="mb-4 flex items-center gap-2 text-2xl font-bold text-indigo-500"
                        >
                            <Image
                                src="/logo.png"
                                alt="TicketBari Logo"
                                width={150}
                                height={100}
                                className="object-contain w-60"
                            />

                        </Link>

                        <p className="text-sm leading-6 text-zinc-400">
                            Book bus, train, launch & flight tickets
                            easily from anywhere in Bangladesh.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-violet-800">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="hover:text-white">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/tickets" className="hover:text-white">
                                    All Tickets
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="hover:text-white">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-violet-800">
                            Contact Info
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-center gap-2 md:justify-start">
                                <Envelope className="size-4" />
                                support@ticketbari.com
                            </div>

                            <div className="flex items-center justify-center gap-2 md:justify-start">
                                <Handset className="size-4" />
                                +880 1234-567890
                            </div>

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 hover:text-white md:justify-start"
                            >
                                <LogoFacebook className="size-4" />
                                Facebook Page
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-violet-800">
                            Payment Methods
                        </h3>

                        <div className="rounded-xl border border-zinc-800 bg-gray-900 p-4">
                            <p className="font-medium text-white">
                                Stripe
                            </p>

                            <p className="mt-2 text-sm text-zinc-400">
                                Secure online payments powered by Stripe.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="border-t border-zinc-800 py-4">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 lg:px-8">
                    © 2025 TicketBari. All rights reserved.
                </div>
            </div>
        </footer>
    );
}