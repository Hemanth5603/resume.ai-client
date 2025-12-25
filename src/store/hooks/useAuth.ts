import { useAuthStore } from '@/store/authStore';
import type { 
  SignInCredentials, 
  SignUpCredentials,
  OAuthProvider,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerification 
} from '@/store/types/auth.types';

/**
 * Custom hook to access authentication state and actions
 * 
 * This hook provides a clean interface to the auth store without
 * directly exposing Clerk or any other auth provider.
 * 
 * Usage:
 * ```tsx
 * const auth = useAuth();
 * 
 * // Sign in
 * await auth.signIn({ email: 'user@example.com', password: 'password' });
 * 
 * // Sign up
 * await auth.signUp({ email: 'user@example.com', password: 'password' });
 * 
 * // OAuth
 * await auth.signInWithOAuth({ provider: 'google' });
 * ```
 */
export function useAuth() {
  const store = useAuthStore();

  return {
    // State
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.isAuthenticated,
    pendingVerification: store.pendingVerification,
    resetPasswordEmail: store.resetPasswordEmail,

    // Actions
    signIn: async (credentials: SignInCredentials) => {
      await store.signIn(credentials);
    },

    signOut: async () => {
      await store.signOut();
    },

    signUp: async (credentials: SignUpCredentials) => {
      await store.signUp(credentials);
    },

    verifyEmail: async (verification: EmailVerification) => {
      await store.verifyEmail(verification);
    },

    signInWithOAuth: async (provider: OAuthProvider) => {
      await store.signInWithOAuth(provider);
    },

    requestPasswordReset: async (request: PasswordResetRequest) => {
      await store.requestPasswordReset(request);
    },

    confirmPasswordReset: async (confirm: PasswordResetConfirm) => {
      await store.confirmPasswordReset(confirm);
    },

    // Helpers
    clearError: () => store.clearError(),
    setError: (error: string) => store.setError({ message: error }),
  };
}

