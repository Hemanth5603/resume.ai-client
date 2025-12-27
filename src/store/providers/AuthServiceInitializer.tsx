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
    // Clerk's SignInResource and SignUpResource are compatible with our interfaces
    // but TypeScript doesn't recognize it, so we use type assertion
    initializeAuthService({
      signIn: signIn as unknown as Parameters<typeof initializeAuthService>[0]['signIn'],
      signUp: signUp as unknown as Parameters<typeof initializeAuthService>[0]['signUp'],
      setActive: (signInSetActive || signUpSetActive) as unknown as Parameters<typeof initializeAuthService>[0]['setActive'],
    });
  }, [signIn, signUp, signInSetActive, signUpSetActive]);

  return <>{children}</>;
}

