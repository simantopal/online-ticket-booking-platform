"use client";

import { Moon, Sun } from "@gravity-ui/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex h-10 w-20 items-center rounded-full bg-zinc-200 dark:bg-zinc-800 transition-all duration-300"
        >
            <div
                className={`absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${isDark ? "translate-x-1" : "translate-x-11"
                    }`}
            >
                {isDark ? (
                    <Moon className="size-4 text-zinc-800" />
                ) : (
                    <Sun className="size-4 text-yellow-500" />
                )}
            </div>
        </button>
    );
}