import { userGuard } from "@/lib/auth-guards";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure only regular users can access (redirect admins)
  await userGuard();

  return <>{children}</>;
}
