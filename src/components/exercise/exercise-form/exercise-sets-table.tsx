"use client";

import { Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { CreateExerciseSetDTO } from "@/types";

interface ExerciseSetsTableProps {
  sets: CreateExerciseSetDTO[];
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onUpdate?: (
    index: number,
    key: keyof CreateExerciseSetDTO,
    value: number | string | undefined,
  ) => void;
  editable?: boolean;
}

export default function ExerciseSetsTable({
  sets,
  onAdd,
  onRemove,
  onUpdate,
  editable = true,
}: ExerciseSetsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Sets</p>
        {editable && (
          <Button type="button" size="sm" variant="outline" onClick={onAdd}>
            Add set
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Set</TableHead>
            <TableHead>Reps</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Rest (sec)</TableHead>
            {editable && (
              <TableHead className="w-14 text-right">Action</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set, index) => (
            <TableRow key={`${set.setNumber}-${index}`}>
              <TableCell>{set.setNumber}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={set.reps}
                  disabled={!editable}
                  onChange={(event) =>
                    onUpdate?.(index, "reps", Number(event.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  step="0.5"
                  value={set.weight}
                  disabled={!editable}
                  onChange={(event) =>
                    onUpdate?.(index, "weight", Number(event.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  value={set.restTime ?? ""}
                  disabled={!editable}
                  onChange={(event) => {
                    const value = event.target.value;
                    onUpdate?.(
                      index,
                      "restTime",
                      value === "" ? undefined : Number(value),
                    );
                  }}
                />
              </TableCell>
              {editable && (
                <TableCell className="text-right">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onRemove?.(index)}
                    disabled={sets.length === 1}
                    aria-label={`Remove set ${set.setNumber}`}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
