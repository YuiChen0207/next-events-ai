import { adminGuard } from "@/lib/auth-guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure only admins can access
  await adminGuard();

  return <>{children}</>;
}
