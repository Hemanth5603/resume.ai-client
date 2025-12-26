"use client";

import { useEffect } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { initializeAuthService } from '@/lib/services/authService';

/**
 * Auth Service Initializer
 * 
 * This component initializes the auth service with Clerk hooks.
 * It should be rendered once at the root of the application.
 * 
 * This is the ONLY place where we directly use Clerk hooks for authentication.
 * All other components should use the centralized auth store/hooks.
 */
export function AuthServiceInitializer({ children }: { children: React.ReactNode }) {
  const { signIn, setActive: signInSetActive } = useSignIn();
  const { signUp, setActive: signUpSetActive } = useSignUp();

  useEffect(() => {
    // Initialize the auth service with Clerk instances
    initializeAuthService({
      signIn,
      signUp,
      setActive: signInSetActive || signUpSetActive,
    });
  }, [signIn, signUp, signInSetActive, signUpSetActive]);

  return <>{children}</>;
}

