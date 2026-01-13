"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  Calendar,
  Ticket,
  User,
  HelpCircle,
  Users,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useUserStore from "@/store/user-store";

export default function PrivateHeader() {
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const userMenuItems = [
    {
      label: "Events",
      href: "/user/events",
      icon: Calendar,
    },
    {
      label: "Bookings",
      href: "/user/bookings",
      icon: Ticket,
    },
    {
      label: "Profile",
      href: "/user/profile",
      icon: User,
    },
    {
      label: "Help",
      href: "/user/help",
      icon: HelpCircle,
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Events",
      href: "/admin/events",
      icon: Calendar,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      icon: Ticket,
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: User,
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary shadow-md">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo / Site Name */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-foreground">
            NextEvents
          </span>
        </Link>

        {/* Desktop: User Name + Hamburger Menu */}
        <div className="flex items-center gap-3">
          <span className="text-sm md:text-base font-semibold text-primary-foreground">
            {user?.name ?? "User"}
          </span>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className="text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer p-2 sm:p-3"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px] h-full flex flex-col"
            >
              <SheetHeader className="pt-6 pb-2">
                <SheetTitle className="text-2xl">Menu</SheetTitle>
              </SheetHeader>
              <div className="px-4">
                <div className="border-b border-gray-200" />
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="mt-6 flex flex-col gap-6 px-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start items-center gap-4 py-5 px-3 text-base rounded-md hover:bg-slate-50"
                      >
                        <item.icon className="h-6 w-6 text-black" />
                        <span className="text-sm text-black">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t mt-auto">
                <div className="px-4 py-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 py-3"
                  >
                    <LogOut className="h-5 w-5 text-black" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
