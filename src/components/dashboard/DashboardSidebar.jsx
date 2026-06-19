import { Bars, Ticket, Envelope, PersonPencil, SquarePlus, TagDollar } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

export function DashboardSidebar() {
    const navItems = [
        { icon: PersonPencil, label: "Profile", href: "/dashboard/vendor/profile" },
        { icon: SquarePlus, label: "Add Ticket", href: "/dashboard/vendor/add-ticket" },
        { icon: Ticket, label: "My Added Tickets", href: "/dashboard/vendor/my-tickets" },
        { icon: Envelope, label: "Requested Bookings", href: "/dashboard/vendor/bookings" },
        { icon: TagDollar, label: "Revenue Overview", href: "/dashboard/vendor/revenue" },
    ];

    const navContent = <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
            <button
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                type="button"
            >
                <item.icon className="size-5 text-muted" />
                {item.label}
            </button>
        ))}
    </nav>

    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                {navContent}
            </aside>
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <Bars />
                    Menu
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