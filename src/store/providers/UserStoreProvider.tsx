"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/store/userStore';
import type { UserProfile } from '@/store/types/user.types';

/**
 * Provider component that syncs Clerk authentication state with Zustand store
 * 
 * This component should be placed high in the component tree to ensure
 * user state is available throughout the application
 */
export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { setUser, setLoading, clearUser } = useUserStore();

  useEffect(() => {
    // Set loading state while Clerk is initializing
    if (!isLoaded) {
      setLoading(true);
      return;
    }

    // If user is signed in, update the store with user data
    if (isSignedIn && user) {
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress || '',
        imageUrl: user.imageUrl,
        phoneNumber: user.primaryPhoneNumber?.phoneNumber || null,
        isSignedIn: true,
        isLoaded: true,
      };
      setUser(userProfile);
    } else {
      // User is not signed in, clear the store
      clearUser();
    }
  }, [user, isLoaded, isSignedIn, setUser, setLoading, clearUser]);

  return <>{children}</>;
}

