import { useUserStore, selectUser, selectIsLoading, selectError, selectIsSignedIn } from '@/store/userStore';
import type { UserProfile } from '@/store/types/user.types';

/**
 * Custom hook to access user state from the Zustand store
 * 
 * Usage:
 * ```tsx
 * const { user, isSignedIn, isLoading } = useUser();
 * ```
 * 
 * @returns User state and utility flags
 */
export function useUserFromStore() {
  const user = useUserStore(selectUser);
  const isLoading = useUserStore(selectIsLoading);
  const error = useUserStore(selectError);
  const isSignedIn = useUserStore(selectIsSignedIn);

  return {
    user,
    isLoading,
    error,
    isSignedIn,
    isLoaded: !isLoading && user !== null,
  };
}

/**
 * Custom hook to access user actions from the Zustand store
 * 
 * Usage:
 * ```tsx
 * const { setUser, clearUser, updateUser } = useUserActions();
 * ```
 * 
 * @returns User store actions
 */
export function useUserActions() {
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const setError = useUserStore((state) => state.setError);

  return {
    setUser,
    updateUser,
    clearUser,
    setLoading,
    setError,
  };
}

/**
 * Hook to get specific user properties
 * 
 * @param key - User property to access
 * @returns The value of the specified user property
 */
export function useUserProperty<K extends keyof UserProfile>(
  key: K
): UserProfile[K] | undefined {
  const user = useUserStore(selectUser);
  return user?.[key];
}

