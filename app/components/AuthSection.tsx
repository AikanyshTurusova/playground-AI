'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthSection() {
  const { isSignedIn, isLoaded } = useUser();
  
  // Show loading state until Clerk is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-slate-200 rounded-lg animate-pulse">
          <div className="w-16 h-4"></div>
        </div>
        <div className="px-4 py-2 bg-slate-200 rounded-lg animate-pulse">
          <div className="w-16 h-4"></div>
        </div>
      </div>
    );
  }
  
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-emerald-600 font-medium">Welcome back!</span>
        <UserButton />
      </div>
    );
  }
  
  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <button className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-600 transition-colors">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
