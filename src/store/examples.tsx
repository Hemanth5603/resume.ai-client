/**
 * Example Usage of User Store
 * 
 * This file demonstrates various ways to use the Zustand user store
 * in your components.
 */

"use client";

// All imports at the top
import Image from "next/image";
import { useUserFromStore, useUserActions, useUserProperty, useUserStore, type UserProfile } from "@/store";
import { useClerk } from "@clerk/nextjs";

// ============================================================================
// Example 1: Basic User Info Display
// ============================================================================

export function UserGreeting() {
  const { user, isSignedIn, isLoading } = useUserFromStore();

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to continue</div>;
  }

  return (
    <div>
      <h1>Welcome back, {user?.fullName}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Using User Actions
// ============================================================================

export function ProfileEditor() {
  const { user } = useUserFromStore();
  const { updateUser } = useUserActions();

  const handleUpdateName = (newName: string) => {
    updateUser({ fullName: newName });
  };

  return (
    <div>
      <input
        type="text"
        value={user?.fullName || ""}
        onChange={(e) => handleUpdateName(e.target.value)}
      />
    </div>
  );
}

// ============================================================================
// Example 3: Specific Property Access (Optimized for Performance)
// ============================================================================

export function UserEmail() {
  // This component only re-renders when email changes
  const email = useUserProperty("email");

  return <div>Contact: {email}</div>;
}

// ============================================================================
// Example 4: Direct Store Access with Custom Selector
// ============================================================================

export function UserAvatar() {
  // Custom selector - only re-renders when imageUrl changes
  const imageUrl = useUserStore((state) => state.user?.imageUrl);

  return (
    <Image 
      src={imageUrl || "/avatar.svg"} 
      alt="User avatar"
      width={40}
      height={40}
      className="rounded-full"
    />
  );
}

// ============================================================================
// Example 5: Conditional Rendering Based on User State
// ============================================================================
export function ProtectedContent() {
  const { isSignedIn, isLoading } = useUserFromStore();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!isSignedIn) {
    return (
      <div>
        <p>You must be signed in to view this content.</p>
        <a href="/auth/login">Sign In</a>
      </div>
    );
  }

  return (
    <div>
      {/* Protected content here */}
      <h2>Exclusive Content</h2>
    </div>
  );
}

// ============================================================================
// Example 6: Using Multiple Store Values
// ============================================================================
export function CompleteUserCard() {
  const { user, isSignedIn, error } = useUserFromStore();

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="card">
      <Image src={user.imageUrl} alt={user.fullName || ""} width={100} height={100} />
      <h3>{user.fullName}</h3>
      <p>{user.email}</p>
      {user.phoneNumber && <p>{user.phoneNumber}</p>}
    </div>
  );
}

// ============================================================================
// Example 7: Logout Handler
// ============================================================================

export function LogoutButton() {
  const { clearUser } = useUserActions();
  const { signOut } = useClerk();

  const handleLogout = () => {
    // Clear Zustand store
    clearUser();
    
    // Sign out from Clerk
    signOut(() => {
      window.location.href = "/";
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ============================================================================
// Example 8: Error Handling
// ============================================================================
export function UserProfileWithError() {
  const { user, error, isLoading } = useUserFromStore();

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return <div>{user?.fullName}</div>;
}

// ============================================================================
// Example 9: Server-Side with Client Component Boundary
// ============================================================================
// Note: This is just an example structure. 
// In real implementation, ServerPage would be in a separate file without "use client"

// Example of how server and client components would interact:
// - Server component fetches user with currentUser() from Clerk
// - Client component uses Zustand store for reactive state
// Both approaches work together seamlessly

// ClientComponent.tsx
export function ClientComponent() {
  const { user } = useUserFromStore();
  return <p>Client: {user?.firstName}</p>;
}

// ============================================================================
// Example 10: Outside React Components (Rare use case)
// ============================================================================

// Get current state outside of React (utility function)
export const getCurrentUser = () => {
  return useUserStore.getState().user;
};

// Subscribe to changes outside of React (for advanced use cases)
export const subscribeToUserChanges = (callback: (user: UserProfile | null) => void) => {
  return useUserStore.subscribe(
    (state) => {
      callback(state.user);
    }
  );
};

// Usage example:
// const unsubscribe = subscribeToUserChanges((user) => {
//   console.log("User changed:", user);
// });
// Remember to unsubscribe when done: unsubscribe();


