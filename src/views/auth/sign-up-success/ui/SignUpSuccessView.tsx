import { cacheLife } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export async function SignUpSuccessView() {
  "use cache";
  cacheLife("max");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration successful!</CardTitle>
        <CardDescription>
          Please check your email to confirm your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to your email address. Click the
          link to activate your account.
        </p>
      </CardContent>
    </Card>
  );
}
