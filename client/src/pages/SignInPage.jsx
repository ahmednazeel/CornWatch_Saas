import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/dashboard" />
    </div>
  );
}
