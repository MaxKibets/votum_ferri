import { getCurrentUser } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default async function ProfilePage() {
  const { data: user } = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Basic user information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Name:</span> {user.name || "Not set"}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </CardContent>
    </Card>
  );
}
