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

// Type for the Clerk instance (will be injected)
let clerkSignIn: any = null;
let clerkSignUp: any = null;
let clerkSetActive: any = null;

/**
 * Initialize the auth service with Clerk instances
 * This should be called from components that have access to Clerk hooks
 */
export function initializeAuthService(instances: {
  signIn?: any;
  signUp?: any;
  setActive?: any;
}) {
  if (instances.signIn) clerkSignIn = instances.signIn;
  if (instances.signUp) clerkSignUp = instances.signUp;
  if (instances.setActive) clerkSetActive = instances.setActive;
}

/**
 * Convert Clerk user to our UserProfile format
 */
function mapClerkUserToProfile(clerkUser: any): UserProfile {
  return {
    id: clerkUser.id,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    fullName: clerkUser.fullName,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    imageUrl: clerkUser.imageUrl,
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
    if (!clerkSignIn) {
      throw new Error('Auth service not initialized');
    }

    const result = await clerkSignIn.create({
      identifier: credentials.email,
      password: credentials.password,
    });

    if (result.status === 'complete') {
      await clerkSetActive({ session: result.createdSessionId });
      
      // Return user profile
      return mapClerkUserToProfile(result.userData || {
        id: result.createdSessionId,
        email: credentials.email,
        firstName: null,
        lastName: null,
        fullName: null,
        imageUrl: '',
        primaryPhoneNumber: null,
      });
    }

    throw new Error('Sign in incomplete');
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    // Import dynamically to avoid SSR issues
    const { useClerk } = await import('@clerk/nextjs');
    const clerk = (window as any).__clerk_client;
    
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
    if (!clerkSignUp) {
      throw new Error('Auth service not initialized');
    }

    const result = await clerkSignUp.attemptEmailAddressVerification({
      code: verification.code,
    });

    if (result.status === 'complete') {
      await clerkSetActive({ session: result.createdSessionId });
      
      // Return user profile
      return mapClerkUserToProfile(result.userData || {
        id: result.createdSessionId,
        email: result.emailAddress || '',
        firstName: result.firstName,
        lastName: result.lastName,
        fullName: `${result.firstName || ''} ${result.lastName || ''}`.trim(),
        imageUrl: '',
        primaryPhoneNumber: null,
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

