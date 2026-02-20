import { Button, TableCell, TableRow } from "@/components/ui";
import type { ExerciseResponse } from "@/types";

interface ExerciseListItemProps {
  exercise: ExerciseResponse;
  onEdit?: (exercise: ExerciseResponse) => void;
  onRemove?: (exerciseId: string) => void;
  editable?: boolean;
}

function getExerciseDetails(exercise: ExerciseResponse) {
  return exercise.sets.map((set) => `${set.reps}x${set.weight}`).join(", ");
}

export default function ExerciseListItem({
  exercise,
  onEdit,
  onRemove,
  editable = false,
}: ExerciseListItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{exercise.name}</TableCell>
      <TableCell>{exercise.sets.length}</TableCell>
      <TableCell>{getExerciseDetails(exercise)}</TableCell>
      {editable && (
        <TableCell className="text-right">
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
        </TableCell>
      )}
    </TableRow>
  );
}
