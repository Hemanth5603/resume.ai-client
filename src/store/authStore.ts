import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  AuthStore, 
  SignInCredentials, 
  SignUpCredentials, 
  OAuthProvider,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerification,
  AuthError 
} from './types/auth.types';
import { authService } from '@/lib/services/authService';
import { useUserStore } from './userStore';

/**
 * Zustand store for managing authentication state and actions
 * 
 * This store acts as an abstraction layer over the authentication provider (Clerk),
 * making it easy to migrate to a different provider in the future.
 * 
 * Features:
 * - Provider-agnostic authentication actions
 * - Centralized error handling
 * - Type-safe operations
 * - Redux DevTools integration
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      isAuthenticated: false,
      pendingVerification: false,
      resetPasswordEmail: null,

      // Sign in with email/password
      signIn: async (credentials: SignInCredentials) => {
        set({ isLoading: true, error: null }, false, 'signIn/start');
        
        try {
          const user = await authService.signIn(credentials);
          
          // Update user store
          useUserStore.getState().setUser(user);
          
          set({ 
            isLoading: false, 
            isAuthenticated: true,
            error: null 
          }, false, 'signIn/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'signIn/error');
          throw authError;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null }, false, 'signOut/start');
        
        try {
          await authService.signOut();
          
          // Clear user store
          useUserStore.getState().clearUser();
          
          set({ 
            isLoading: false, 
            isAuthenticated: false,
            error: null 
          }, false, 'signOut/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'signOut/error');
          throw authError;
        }
      },

      // Sign up with email/password
      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true, error: null }, false, 'signUp/start');
        
        try {
          await authService.signUp(credentials);
          
          set({ 
            isLoading: false, 
            pendingVerification: true,
            error: null 
          }, false, 'signUp/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'signUp/error');
          throw authError;
        }
      },

      // Verify email with code
      verifyEmail: async (verification: EmailVerification) => {
        set({ isLoading: true, error: null }, false, 'verifyEmail/start');
        
        try {
          const user = await authService.verifyEmail(verification);
          
          // Update user store
          useUserStore.getState().setUser(user);
          
          set({ 
            isLoading: false, 
            isAuthenticated: true,
            pendingVerification: false,
            error: null 
          }, false, 'verifyEmail/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'verifyEmail/error');
          throw authError;
        }
      },

      // Sign in with OAuth
      signInWithOAuth: async (provider: OAuthProvider) => {
        set({ isLoading: true, error: null }, false, 'signInWithOAuth/start');
        
        try {
          // OAuth redirect - this doesn't return, it redirects the user
          await authService.signInWithOAuth(provider);
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'signInWithOAuth/error');
          throw authError;
        }
      },

      // Request password reset
      requestPasswordReset: async (request: PasswordResetRequest) => {
        set({ isLoading: true, error: null }, false, 'requestPasswordReset/start');
        
        try {
          await authService.requestPasswordReset(request);
          
          set({ 
            isLoading: false, 
            resetPasswordEmail: request.email,
            error: null 
          }, false, 'requestPasswordReset/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'requestPasswordReset/error');
          throw authError;
        }
      },

      // Confirm password reset with code
      confirmPasswordReset: async (confirm: PasswordResetConfirm) => {
        set({ isLoading: true, error: null }, false, 'confirmPasswordReset/start');
        
        try {
          await authService.confirmPasswordReset(confirm);
          
          set({ 
            isLoading: false, 
            resetPasswordEmail: null,
            error: null 
          }, false, 'confirmPasswordReset/success');
        } catch (error) {
          const authError = get().parseError(error);
          set({ 
            isLoading: false, 
            error: authError 
          }, false, 'confirmPasswordReset/error');
          throw authError;
        }
      },

      // State management helpers
      setLoading: (isLoading: boolean) => 
        set({ isLoading }, false, 'setLoading'),

      setError: (error: AuthError | null) => 
        set({ error, isLoading: false }, false, 'setError'),

      clearError: () => 
        set({ error: null }, false, 'clearError'),

      setPendingVerification: (pending: boolean) => 
        set({ pendingVerification: pending }, false, 'setPendingVerification'),

      setResetPasswordEmail: (email: string | null) => 
        set({ resetPasswordEmail: email }, false, 'setResetPasswordEmail'),

      // Helper to parse errors from any source
      parseError: (error: unknown): AuthError => {
        if (typeof error === 'object' && error !== null) {
          const err = error as {
            errors?: Array<{
              message: string;
              longMessage?: string;
              code?: string;
              meta?: { paramName?: string };
            }>;
            message?: string;
          };
          
          // Handle Clerk error format
          if (err.errors && Array.isArray(err.errors) && err.errors[0]) {
            return {
              message: err.errors[0].longMessage || err.errors[0].message,
              code: err.errors[0].code,
              field: err.errors[0].meta?.paramName,
            };
          }
          
          // Handle standard Error
          if (err.message) {
            return { message: err.message };
          }
        }
        
        return { message: 'An unexpected error occurred' };
      },
    }),
    {
      name: 'AuthStore',
    }
  )
);

// Selectors
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectPendingVerification = (state: AuthStore) => state.pendingVerification;
export const selectResetPasswordEmail = (state: AuthStore) => state.resetPasswordEmail;

