import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/users";

interface RoleGuardOptions {
  allowedRoles: ("admin" | "user")[]; // 陣列允許多角色同時存取同一頁面
  redirectPath: string;
}

/**
 * Role-based route guard
 * Checks if user has required role, redirects if not
 */
export async function roleGuard(options: RoleGuardOptions): Promise<void> {
  const result = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;

  // Check if user has required role
  if (!options.allowedRoles.includes(user.role)) {
    redirect(options.redirectPath);
  }
}

/**
 * Admin-only guard
 */
export async function adminGuard(): Promise<void> {
  await roleGuard({
    allowedRoles: ["admin"],
    redirectPath: "/user/events",
  });
}

/**
 * User-only guard (redirects admins)
 */
export async function userGuard(): Promise<void> {
  await roleGuard({
    allowedRoles: ["user"],
    redirectPath: "/admin/dashboard",
  });
}
