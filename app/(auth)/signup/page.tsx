import { SignupForm } from "@/features/auth/components/signup-form";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { type Metadata } from "next";
export const metadata:Metadata={
    title:"Sign up",
    description:"Create an account to get started"

}
export default function SignupPage() {
  return (
    <AuthSplitLayout type="signup">
      <SignupForm />
    </AuthSplitLayout>
  );
}
