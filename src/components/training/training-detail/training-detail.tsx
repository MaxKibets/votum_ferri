"use client";

import { useState } from "react";
import { ExerciseList } from "@/components/exercise";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import type { TrainingResponse } from "@/types";

interface TrainingDetailProps {
  training: TrainingResponse;
  onEdit?: () => void;
  onDelete?: () => void;
  editable?: boolean;
}

function formatTrainingDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(`${date}T00:00:00`));
}

export default function TrainingDetail({
  training,
  onEdit,
  onDelete,
  editable = false,
}: TrainingDetailProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{training.name ?? "Untitled training"}</CardTitle>
        <CardDescription>{formatTrainingDate(training.date)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ExerciseList exercises={training.exercises} editable={false} />

        {training.description && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">
              {training.description}
            </p>
          </div>
        )}
      </CardContent>

      {editable && (
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </CardFooter>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete training</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The training and all related
              exercises will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
