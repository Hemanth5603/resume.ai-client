// Export user store
export { 
    useUserStore, 
    selectUser, 
    selectIsLoading, 
    selectError, 
    selectIsSignedIn 
} from './userStore';

// Export auth store
export {
    useAuthStore,
    selectIsLoading as selectAuthIsLoading,
    selectError as selectAuthError,
    selectIsAuthenticated,
    selectPendingVerification,
    selectResetPasswordEmail,
} from './authStore';

// Export user types
export type { 
    UserProfile, 
    UserStoreState, 
    UserStoreActions, 
    UserStore 
} from './types/user.types';

// Export auth types
export type {
    SignInCredentials,
    SignUpCredentials,
    OAuthProvider,
    PasswordResetRequest,
    PasswordResetConfirm,
    EmailVerification,
    AuthError,
    AuthState,
    AuthActions,
    AuthStore,
} from './types/auth.types';

// Export hooks
export { 
    useUserFromStore, 
    useUserActions, 
    useUserProperty 
} from './hooks/useUser';

export { useAuth } from './hooks/useAuth';

// Export providers
export { UserStoreProvider } from './providers/UserStoreProvider';
export { AuthServiceInitializer } from './providers/AuthServiceInitializer';

