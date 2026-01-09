import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/users";
import PrivateHeader from "@/components/layout/PrivateHeader";

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
      <PrivateHeader user={user} />
      <main>{children}</main>
    </div>
  );
}
