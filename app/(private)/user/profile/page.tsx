"use client";

import { PageTitle } from "@/components/ui/page-title";
import { BackButton } from "@/components/ui/back-button";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ActivityStatsCard } from "@/components/profile/ActivityStatsCard";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { FormField } from "@/components/profile/FormField";
import { PreferenceToggle } from "@/components/profile/PreferenceToggle";
import { ActionButton } from "@/components/profile/ActionButton";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Bell,
  Lock,
} from "lucide-react";

export default function UserProfilePage() {
  // Mock data - will be replaced with real data from Supabase
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+886 912 345 678",
    joinDate: "2024-01-15",
    location: "Taipei, Taiwan",
  };

  const activityStats = [
    { label: "Events Attended", value: "12", icon: Ticket },
    { label: "Total Bookings", value: "18", icon: Calendar },
    { label: "Upcoming Events", value: "3", icon: Clock },
  ];

  const notificationPreferences = [
    {
      icon: Mail,
      title: "Email Notifications",
      description: "Receive updates about your bookings via email",
    },
    {
      icon: Bell,
      title: "Event Reminders",
      description: "Get reminded before your upcoming events",
    },
    {
      icon: Ticket,
      title: "Marketing Updates",
      description: "Receive news about new events and promotions",
    },
  ];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <BackButton href="/user/events" label="Back to Events" />
      <PageTitle>My Profile</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileHeader
            name={user.name}
            subtitle="Member"
            details={[
              { icon: Mail, text: user.email },
              { icon: Phone, text: user.phone },
              { icon: MapPin, text: user.location },
              {
                icon: Calendar,
                text: `Joined ${new Date(user.joinDate).toLocaleDateString()}`,
              },
            ]}
            avatarPlaceholder={
              <User className="w-12 h-12 text-muted-foreground" />
            }
          />

          <ActivityStatsCard title="Activity Summary" stats={activityStats} />
        </div>

        {/* Settings Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <SettingsSection
            title="Personal Information"
            description="Update your personal details and information"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                defaultValue={user.name}
                placeholder="Enter your name"
              />
              <FormField
                label="Email Address"
                type="email"
                defaultValue={user.email}
                placeholder="Enter your email"
              />
              <FormField
                label="Phone Number"
                type="tel"
                defaultValue={user.phone}
                placeholder="Enter your phone"
              />
              <FormField
                label="Location"
                defaultValue={user.location}
                placeholder="Enter your location"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-sm border border-border/60 hover:bg-muted transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection
            title="Notification Preferences"
            description="Manage how you receive notifications"
          >
            <div className="space-y-4">
              {notificationPreferences.map((pref, index) => (
                <PreferenceToggle
                  key={index}
                  icon={pref.icon}
                  title={pref.title}
                  description={pref.description}
                  defaultChecked={index < 2}
                />
              ))}
            </div>
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            title="Security"
            description="Manage your password and security settings"
          >
            <ActionButton icon={Lock} label="Change Password" />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
