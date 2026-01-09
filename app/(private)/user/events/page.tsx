import React from "react";
import { getCurrentUser } from "@/actions/users";
import { redirect } from "next/navigation";

async function UserEventsPage() {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Events</h1>

        {/* User Profile Card */}
        <div className="bg-card border rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Role:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Events List Placeholder */}
        <div className="bg-card border rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Events</h2>
          <p className="text-muted-foreground">
            No events yet. Start booking your first event!
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserEventsPage;
