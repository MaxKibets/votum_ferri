import { Suspense } from "react";
import { AuthErrorView } from "@/views/auth/error";

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorView />
    </Suspense>
  );
}
