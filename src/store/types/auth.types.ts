// Authentication-related types

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface OAuthProvider {
  provider: 'google' | 'apple' | 'linkedin_oidc';
  redirectUrl?: string;
  redirectUrlComplete?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  code: string;
  newPassword: string;
}

export interface EmailVerification {
  code: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  pendingVerification: boolean;
  resetPasswordEmail: string | null;
}

export interface AuthActions {
  // Sign in/out
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Sign up
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  verifyEmail: (verification: EmailVerification) => Promise<void>;
  
  // OAuth
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  
  // Password reset
  requestPasswordReset: (request: PasswordResetRequest) => Promise<void>;
  confirmPasswordReset: (confirm: PasswordResetConfirm) => Promise<void>;
  
  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
  clearError: () => void;
  setPendingVerification: (pending: boolean) => void;
  setResetPasswordEmail: (email: string | null) => void;
  
  // Helper
  parseError: (error: unknown) => AuthError;
}

export type AuthStore = AuthState & AuthActions;

