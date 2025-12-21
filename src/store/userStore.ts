import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserStore, UserProfile } from './types/user.types';

/**
 * Zustand store for managing user state across the application
 * 
 * Features:
 * - Persists user data to localStorage
 * - Redux DevTools integration for debugging
 * - Type-safe actions and state
 */
export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user: UserProfile | null) =>
          set({ user, isLoading: false, error: null }, false, 'setUser'),

        updateUser: (updates: Partial<UserProfile>) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'updateUser'
          ),

        clearUser: () =>
          set({ user: null, isLoading: false, error: null }, false, 'clearUser'),

        setLoading: (isLoading: boolean) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error: string | null) =>
          set({ error, isLoading: false }, false, 'setError'),
      }),
      {
        name: 'user-storage', // localStorage key
        partialize: (state) => ({ user: state.user }), // Only persist user data
      }
    ),
    {
      name: 'UserStore', // DevTools name
    }
  )
);

// Selectors for better performance
export const selectUser = (state: UserStore) => state.user;
export const selectIsLoading = (state: UserStore) => state.isLoading;
export const selectError = (state: UserStore) => state.error;
export const selectIsSignedIn = (state: UserStore) => state.user?.isSignedIn ?? false;

