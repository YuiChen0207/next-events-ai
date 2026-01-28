"use client";

import { PageTitle } from "@/components/ui/page-title";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SystemStatsGrid } from "@/components/profile/SystemStatsGrid";
import { QuickActionsCard } from "@/components/profile/QuickActionsCard";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { FormField } from "@/components/profile/FormField";
import { PreferenceToggle } from "@/components/profile/PreferenceToggle";
import { ActionButton } from "@/components/profile/ActionButton";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Activity,
  Users,
  Ticket,
  Settings,
  Bell,
  Lock,
} from "lucide-react";

export default function AdminProfilePage() {
  // Mock data - will be replaced with real data from Supabase
  const admin = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    joinDate: "2023-06-01",
    lastLogin: "2024-01-27 10:30 AM",
  };

  const systemStats = [
    { label: "Total Users", value: "1,234", icon: Users, trend: "+12%" },
    { label: "Active Events", value: "45", icon: Calendar, trend: "+8%" },
    { label: "Total Bookings", value: "856", icon: Ticket, trend: "+24%" },
    { label: "System Health", value: "98%", icon: Activity, trend: "+2%" },
  ];

  const quickActions = [
    { label: "System Settings", icon: Settings },
    { label: "Manage Users", icon: Users },
    { label: "View Analytics", icon: Activity },
  ];

  const preferences = [
    {
      icon: Bell,
      title: "System Alerts",
      description: "Receive critical system notifications",
    },
    {
      icon: Users,
      title: "User Activity Alerts",
      description: "Get notified of suspicious user activities",
    },
    {
      icon: Activity,
      title: "Performance Reports",
      description: "Weekly system performance summaries",
    },
  ];

  const securityActions = [
    { icon: Lock, label: "Change Password" },
    { icon: Activity, label: "View Login History" },
    { icon: Settings, label: "Manage API Keys" },
  ];

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <PageTitle>Admin Profile</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileHeader
            name={admin.name}
            subtitle="System Administrator"
            badge={{ icon: Shield, label: admin.role }}
            details={[
              { icon: Mail, text: admin.email },
              {
                icon: Calendar,
                text: `Admin since ${new Date(admin.joinDate).toLocaleDateString()}`,
              },
              { icon: Activity, text: `Last login: ${admin.lastLogin}` },
            ]}
            avatarPlaceholder={
              <User className="w-12 h-12 text-muted-foreground" />
            }
          />

          <QuickActionsCard title="Quick Actions" actions={quickActions} />
        </div>

        {/* Admin Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Overview */}
          <SettingsSection
            title="System Overview"
            description="Real-time platform statistics and metrics"
          >
            <SystemStatsGrid stats={systemStats} />
          </SettingsSection>

          {/* Admin Information */}
          <SettingsSection
            title="Admin Information"
            description="Update your administrator details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                defaultValue={admin.name}
                placeholder="Enter your name"
              />
              <FormField
                label="Email Address"
                type="email"
                defaultValue={admin.email}
                placeholder="Enter your email"
              />
              <FormField label="Role" value={admin.role} disabled />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Two-Factor Authentication
                </label>
                <button className="w-full px-4 py-2 rounded-sm border border-border/60 hover:bg-muted transition-colors text-left flex items-center justify-between">
                  <span className="text-sm">Configure 2FA</span>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
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

          {/* Admin Preferences */}
          <SettingsSection
            title="Admin Preferences"
            description="Configure your admin dashboard preferences"
          >
            <div className="space-y-4">
              {preferences.map((pref, index) => (
                <PreferenceToggle
                  key={index}
                  icon={pref.icon}
                  title={pref.title}
                  description={pref.description}
                  defaultChecked
                />
              ))}
            </div>
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection
            title="Security Settings"
            description="Manage security and access controls"
          >
            <div className="space-y-3">
              {securityActions.map((action, index) => (
                <ActionButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                />
              ))}
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
