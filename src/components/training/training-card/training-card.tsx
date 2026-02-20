import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { TrainingResponse } from "@/types";

interface TrainingCardProps {
  training: TrainingResponse;
}

function formatTrainingDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(`${date}T00:00:00`));
}

export default function TrainingCard({ training }: TrainingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{training.name ?? "Untitled training"}</CardTitle>
        <CardDescription>{formatTrainingDate(training.date)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {training.exercises.length} exercises
          </Badge>
        </div>

        {training.description && (
          <p className="text-sm text-muted-foreground">
            {training.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button asChild variant="outline">
          <Link href={`/training/${training.id}`}>Open details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
