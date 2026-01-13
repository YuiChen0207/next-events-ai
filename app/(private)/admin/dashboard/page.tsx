"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/user-store";

function AdminDashboardPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (user.role !== "admin") {
      router.push("/user/events");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Admin Profile Card */}
        <div className="bg-card border rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Administrator Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Role:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">
                User ID:
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.user_id}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Events
            </h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-card border rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-card border rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active Bookings
            </h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Management Section Placeholder */}
        <div className="bg-card border rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">
            Admin management features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
