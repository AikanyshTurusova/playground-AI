'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthSection() {
  const { isSignedIn } = useUser();
  
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-green-600 font-medium">Welcome back!</span>
        <UserButton />
      </div>
    );
  }
  
  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
