// User-related types for the Zustand store

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  imageUrl: string;
  phoneNumber: string | null;
  isSignedIn: boolean;
  isLoaded: boolean;
}

export interface UserStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserStoreActions {
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type UserStore = UserStoreState & UserStoreActions;

