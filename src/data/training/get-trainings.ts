import { createServerClient } from "@/lib/supabase";
import type { GetTrainingsParams } from "@/types";

export async function getTrainings({
  userId,
  params,
}: {
  userId: string;
  params?: GetTrainingsParams;
}) {
  const supabase = await createServerClient();
  let query = supabase
    .from("trainings")
    .select(
      "id, user_id, date, name, description, created_at, updated_at, exercises(id, training_id, name, order_number, notes, created_at, updated_at, exercise_sets(id, exercise_id, set_number, reps, weight, rest_time, completed, notes, created_at, updated_at))",
      { count: "exact" },
    )
    .eq("user_id", userId);

  if (params?.month) {
    const [year, month] = params.month.split("-").map(Number);
    const monthStart = new Date(Date.UTC(year, month - 1, 1))
      .toISOString()
      .slice(0, 10);
    const monthEnd = new Date(Date.UTC(year, month, 1))
      .toISOString()
      .slice(0, 10);

    query = query.gte("date", monthStart).lt("date", monthEnd);
  }

  if (params?.date) {
    query = query.eq("date", params.date);
  }

  if (typeof params?.offset === "number") {
    query = query.range(
      params.offset,
      params.offset + (params.limit ?? 20) - 1,
    );
  } else if (typeof params?.limit === "number") {
    query = query.limit(params.limit);
  }

  return query.order("date", { ascending: false });
}
