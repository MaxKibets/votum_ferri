import { getCurrentUser } from "@/actions/auth";
import { LogoutButton } from "@/components/auth";
import { ROUTE } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { data, error } = await getCurrentUser();

  if (error || !data) {
    redirect(ROUTE.LOGIN);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <p className="text-muted-foreground">
          Welcome, {data.user.name || data.user.email}! This is your dashboard.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Training calendar and features will be available in Phase 4.
        </p>
      </div>
    </div>
  );
}
