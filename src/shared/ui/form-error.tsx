import { cn } from "@/shared/lib/cn";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  return message ? (
    <p className={cn("text-destructive text-sm", className)}>{message}</p>
  ) : null;
}
