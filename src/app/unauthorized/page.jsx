"use client";

import Link from "next/link";
import { ShieldExclamation } from "@gravity-ui/icons";
import { Button } from "@heroui/react";

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <ShieldExclamation className="h-20 w-20 text-danger" />
                </div>

                <h1 className="mb-3 text-5xl font-bold">403</h1>

                <h2 className="mb-4 text-2xl font-semibold">
                    Access Denied
                </h2>

                <p className="mb-8 text-default-500">
                    You do not have permission to access this page.
                    Please log in with the appropriate account or
                    return to the homepage.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-primary-foreground"
                    >
                        Go Home
                    </Link>

                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center justify-center rounded-xl border px-4 py-2"
                    >
                        Signin
                    </Link>
                </div>
            </div>
        </main>
    );
}