import { getCurrentUser } from "@/actions/auth";
import { LogoutButton } from "@/components/auth";

export default async function DashboardPage() {
  const result = await getCurrentUser();
  const user = result.data;

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <p className="text-muted-foreground">
          Welcome, {user.name || user.email}! This is your dashboard.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Training calendar and features will be available in Phase 4.
        </p>
      </div>
    </div>
  );
}
