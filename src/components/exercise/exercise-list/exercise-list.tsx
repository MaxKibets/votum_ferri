import {
  Button,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { ExerciseResponse } from "@/types";
import ExerciseCard from "../exercise-card";
import ExerciseListItem from "./exercise-list-item";

interface ExerciseListProps {
  exercises: ExerciseResponse[];
  onEdit?: (exercise: ExerciseResponse) => void;
  onRemove?: (exerciseId: string) => void;
  editable?: boolean;
}

function sortByOrder(exercises: ExerciseResponse[]) {
  return [...exercises].sort((a, b) => a.order - b.order);
}

export default function ExerciseList({
  exercises,
  onEdit,
  onRemove,
  editable = false,
}: ExerciseListProps) {
  const sortedExercises = sortByOrder(exercises);

  if (sortedExercises.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-center text-muted-foreground">
              No exercises yet.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 md:hidden">
        {sortedExercises.map((exercise) => (
          <div key={exercise.id} className="space-y-2">
            <ExerciseCard exercise={exercise} />
            {editable && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(exercise)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove?.(exercise.id)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercise</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead>Details</TableHead>
              {editable && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                onEdit={onEdit}
                onRemove={onRemove}
                editable={editable}
              />
            ))}
          </TableBody>
          <TableCaption>{sortedExercises.length} exercises total</TableCaption>
        </Table>
      </div>
    </div>
  );
}
