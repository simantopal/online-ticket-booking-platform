import { getUserSession } from "@/lib/core/session";
import { Ticket, Envelope, PersonPencil, SquarePlus, TagDollar, LayoutSideContent, ClockArrowRotateLeft, Persons, BroadcastSignal } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export async function DashboardSidebar() {

    const user = await getUserSession()

    const passengerNavLinks = [
        { icon: PersonPencil, label: "Profile", href: "/dashboard/passenger/profile" },
        { icon: SquarePlus, label: "My Booked Tickets", href: "/dashboard/passenger/booked-tickets" },
        { icon: ClockArrowRotateLeft, label: "Transaction History", href: "/dashboard/vendor/Transaction" },
    ]

    const vendorNavLinks = [
        { icon: PersonPencil, label: "Profile", href: "/dashboard/vendor/profile" },
        { icon: SquarePlus, label: "Add Ticket", href: "/dashboard/vendor/add-tickets" },
        { icon: Ticket, label: "My Added Tickets", href: "/dashboard/vendor/my-tickets" },
        { icon: Envelope, label: "Requested Bookings", href: "/dashboard/vendor/bookings" },
        { icon: TagDollar, label: "Revenue Overview", href: "/dashboard/vendor/revenue" },
    ]

    const adminNavLinks = [
        { icon: PersonPencil, label: "Profile", href: "/dashboard/admin/profile" },
        { icon: Ticket, label: "Manage Tickets", href: "/dashboard/admin/manage-tickets" },
        { icon: Persons, label: "Manage Users", href: "/dashboard/admin/manage-users" },
        { icon: BroadcastSignal, label: "Advertise Tickets", href: "/dashboard/admin/advertisements" },
    ]

    const NavLinksMap= {
        passenger: passengerNavLinks,
        vendor: vendorNavLinks,
        admin: adminNavLinks
    }

    const navItems = NavLinksMap[user?.role || 'passenger']

    const navContent = <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
            <Link
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                type="button"
                href={item.href}
            >
                <item.icon className="size-5 text-muted" />
                {item.label}
            </Link>
        ))}
    </nav>

    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                {navContent}
            </aside>
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <LayoutSideContent />
                    
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {navContent}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}