import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { ExerciseResponse } from "@/types";

interface ExerciseCardProps {
  exercise: ExerciseResponse;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        <CardDescription>
          {exercise.sets.length} sets in this exercise
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {exercise.sets.map((set) => (
            <Badge key={set.id} variant="outline">
              #{set.setNumber}: {set.reps} x {set.weight}kg
            </Badge>
          ))}
        </div>

        {exercise.notes && (
          <p className="text-sm text-muted-foreground">{exercise.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
