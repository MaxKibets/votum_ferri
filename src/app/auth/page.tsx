import { AuthFormLayout } from "@/components/auth";
import { Suspense } from "react";

export default function AuthPage() {
  return
  <Suspense fallback={<div>Loading...</div>}>
    <AuthFormLayout />
  </Suspense>
  );
}
