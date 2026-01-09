"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IUser } from "@/interfaces";

interface PrivateHeaderProps {
  user: IUser;
}

export default function PrivateHeader({ user }: PrivateHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      label: user.role === "admin" ? "Dashboard" : "My Events",
      href: user.role === "admin" ? "/admin/dashboard" : "/user/events",
      icon: user.role === "admin" ? LayoutDashboard : Calendar,
    },
  ];

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
            {user.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-10 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-primary-foreground/20 bg-primary">
          <nav className="container flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
