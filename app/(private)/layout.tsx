import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/users";
import PrivateHeader from "@/components/layout/PrivateHeader";
import SetUserClient from "@/hooks/SetUserClient";
import RouteLoadingIndicator from "@/components/layout/RouteLoadingIndicator";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user
  const result = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;

  return (
    <div className="min-h-screen bg-background">
      <SetUserClient user={user} />
      <PrivateHeader />
      <RouteLoadingIndicator />
      <main>{children}</main>
    </div>
  );
}
