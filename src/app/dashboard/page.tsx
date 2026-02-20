import { getCurrentUser } from "@/actions/auth";
import { getTrainings } from "@/actions/training";
import { TrainingCard } from "@/components/training";

export default async function DashboardPage() {
  const { data: user } = await getCurrentUser();

  if (!user) {
    return null;
  }

  const trainingsResult = await getTrainings({ limit: 6 });
  const trainings = trainingsResult.data?.trainings ?? [];

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user.name || user.email}! Core UI components are ready, and
          calendar integration is planned for Phase 4.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>

      {trainings.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You do not have any trainings yet.
        </p>
      )}
    </section>
  );
}
