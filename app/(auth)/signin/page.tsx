import { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/signin-form";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

export const metadata: Metadata = {
  title: "Sign in | Sanad AI",
  description: "Sign in to access your business chat studio and manage customer inquiries.",
};

export default function SignInPage() {
  return (
    <AuthSplitLayout type="signin">
      <SignInForm />
    </AuthSplitLayout>
  );
}
