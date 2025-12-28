/**
 * Authentication Service
 * 
 * This service provides an abstraction layer over the authentication provider (currently Clerk).
 * All authentication operations should go through this service to maintain provider independence.
 * 
 * To migrate to a different auth provider:
 * 1. Update the implementation in this file
 * 2. Keep the same interface/API
 * 3. No changes needed in components or stores
 */

import type { 
  SignInCredentials, 
  SignUpCredentials, 
  OAuthProvider,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerification 
} from '@/store/types/auth.types';
import type { UserProfile } from '@/store/types/user.types';

// Clerk result types
interface ClerkResult {
  status: string | null;
  createdSessionId?: string | null;
  userData?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    primaryEmailAddress?: { emailAddress: string };
    imageUrl?: string;
    primaryPhoneNumber?: { phoneNumber: string };
  };
  emailAddress?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

// Clerk instance types - these match Clerk's actual SignInResource and SignUpResource
interface ClerkSignIn {
  create: (params: { identifier: string; password: string } | { strategy: string; identifier: string }) => Promise<ClerkResult>;
  authenticateWithRedirect: (params: { strategy: string; redirectUrl: string; redirectUrlComplete: string }) => Promise<void>;
  attemptFirstFactor: (params: { strategy: string; code: string; password: string }) => Promise<ClerkResult>;
}

interface ClerkSignUp {
  create: (params: { emailAddress: string; password: string; firstName?: string; lastName?: string }) => Promise<ClerkResult>;
  prepareEmailAddressVerification: (params: { strategy: string }) => Promise<void>;
  attemptEmailAddressVerification: (params: { code: string }) => Promise<ClerkResult>;
}

// Type for the Clerk instance (will be injected)
let clerkSignIn: ClerkSignIn | null = null;
let clerkSignUp: ClerkSignUp | null = null;
let clerkSetActive: ((params: { session: string }) => Promise<void>) | null = null;

/**
 * Initialize the auth service with Clerk instances
 * This should be called from components that have access to Clerk hooks
 */
export function initializeAuthService(instances: {
  signIn?: ClerkSignIn;
  signUp?: ClerkSignUp;
  setActive?: (params: { session: string }) => Promise<void>;
}) {
  if (instances.signIn) clerkSignIn = instances.signIn;
  if (instances.signUp) clerkSignUp = instances.signUp;
  if (instances.setActive) clerkSetActive = instances.setActive;
}

/**
 * Convert Clerk user to our UserProfile format
 */
function mapClerkUserToProfile(clerkUser: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  primaryEmailAddress?: { emailAddress: string };
  imageUrl?: string;
  primaryPhoneNumber?: { phoneNumber: string };
}): UserProfile {
  return {
    id: clerkUser.id,
    firstName: clerkUser.firstName || null,
    lastName: clerkUser.lastName || null,
    fullName: clerkUser.fullName || null,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    imageUrl: clerkUser.imageUrl || '',
    phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || null,
    isSignedIn: true,
    isLoaded: true,
  };
}

/**
 * Auth Service API
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<UserProfile> {
    if (!clerkSignIn || !clerkSetActive) {
      throw new Error('Auth service not initialized');
    }

    const result = await clerkSignIn.create({
      identifier: credentials.email,
      password: credentials.password,
    });

    if (result.status === 'complete' && result.createdSessionId) {
      await clerkSetActive({ session: result.createdSessionId });
      
      // Return user profile
      return mapClerkUserToProfile(result.userData || {
        id: result.createdSessionId,
        primaryEmailAddress: { emailAddress: credentials.email },
        firstName: null,
        lastName: null,
        fullName: null,
        imageUrl: '',
      });
    }

    throw new Error('Sign in incomplete');
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    // Access Clerk client directly from window
    const clerk = (window as Window & { __clerk_client?: { signOut: () => Promise<void> } }).__clerk_client;
    
    if (clerk) {
      await clerk.signOut();
    }
  },

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials): Promise<void> {
    if (!clerkSignUp) {
      throw new Error('Auth service not initialized');
    }

    await clerkSignUp.create({
      emailAddress: credentials.email,
      password: credentials.password,
      ...(credentials.firstName && { firstName: credentials.firstName }),
      ...(credentials.lastName && { lastName: credentials.lastName }),
    });

    // Prepare email verification
    await clerkSignUp.prepareEmailAddressVerification({ 
      strategy: 'email_code' 
    });
  },

  /**
   * Verify email with code
   */
  async verifyEmail(verification: EmailVerification): Promise<UserProfile> {
    if (!clerkSignUp || !clerkSetActive) {
      throw new Error('Auth service not initialized');
    }

    const result = await clerkSignUp.attemptEmailAddressVerification({
      code: verification.code,
    });

    if (result.status === 'complete' && result.createdSessionId) {
      await clerkSetActive({ session: result.createdSessionId });
      
      // Return user profile
      return mapClerkUserToProfile(result.userData || {
        id: result.createdSessionId,
        primaryEmailAddress: { emailAddress: result.emailAddress || '' },
        firstName: result.firstName || null,
        lastName: result.lastName || null,
        fullName: `${result.firstName || ''} ${result.lastName || ''}`.trim() || null,
        imageUrl: '',
      });
    }

    throw new Error('Email verification incomplete');
  },

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: OAuthProvider): Promise<void> {
    if (!clerkSignIn) {
      throw new Error('Auth service not initialized');
    }

    const strategy = `oauth_${provider.provider}` as const;

    await clerkSignIn.authenticateWithRedirect({
      strategy,
      redirectUrl: provider.redirectUrl || '/sso-callback',
      redirectUrlComplete: provider.redirectUrlComplete || '/',
    });
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    if (!clerkSignIn) {
      throw new Error('Auth service not initialized');
    }

    await clerkSignIn.create({
      strategy: 'reset_password_email_code',
      identifier: request.email,
    });
  },

  /**
   * Confirm password reset with code and new password
   */
  async confirmPasswordReset(confirm: PasswordResetConfirm): Promise<void> {
    if (!clerkSignIn) {
      throw new Error('Auth service not initialized');
    }

    const result = await clerkSignIn.attemptFirstFactor({
      strategy: 'reset_password_email_code',
      code: confirm.code,
      password: confirm.newPassword,
    });

    if (result.status !== 'complete') {
      throw new Error('Password reset incomplete');
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<void> {
    if (!clerkSignUp) {
      throw new Error('Auth service not initialized');
    }

    await clerkSignUp.prepareEmailAddressVerification({ 
      strategy: 'email_code' 
    });
  },
};

