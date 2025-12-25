"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/CustomAuth.module.css";
import AuthLeftPanel from "./AuthLeftPanel";
import { useAuth } from "@/store/hooks/useAuth";

const ForgotPassword = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const router = useRouter();

  // Step 1: Request password reset code
  const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    try {
      await auth.requestPasswordReset({ email });
      setSuccessMessage("We've sent a verification code to your email!");
      setStep("code");
    } catch (err) {
      console.error("Password reset request error:", err);
    }
  };

  // Step 2: Verify code and reset password
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    setLocalError("");
    setSuccessMessage("");

    try {
      await auth.confirmPasswordReset({ code, newPassword });
      setSuccessMessage("Password reset successful! Redirecting to login...");
      setStep("success");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
    }
  };

  // Email input form
  if (step === "email") {
    return (
      <div className={styles.splitContainer}>
        <AuthLeftPanel />
        
        <div className={styles.rightPanel}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Reset your password</h1>
              <p className={styles.authSubtitle}>
                Enter your email address and we&apos;ll send you a code to reset your password
              </p>
            </div>

          {(auth.error || localError) && (
            <div className={styles.errorMessage}>
              <span>⚠️ {localError || auth.error?.message}</span>
            </div>
          )}

            {successMessage && (
              <div className={styles.successMessage}>
                <span>✓ {successMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestReset} className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={auth.isLoading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={auth.isLoading}
              >
                {auth.isLoading ? "Sending code..." : "Send reset code"}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                Remember your password?{" "}
                <Link href="/auth/login" className={styles.footerLink}>
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Code verification and new password form
  if (step === "code") {
    return (
      <div className={styles.splitContainer}>
        <AuthLeftPanel />
        
        <div className={styles.rightPanel}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Enter verification code</h1>
              <p className={styles.authSubtitle}>
                We sent a code to <strong>{email}</strong>
              </p>
            </div>

          {(auth.error || localError) && (
            <div className={styles.errorMessage}>
              <span>⚠️ {localError || auth.error?.message}</span>
            </div>
          )}

            <form onSubmit={handleResetPassword} className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="code" className={styles.label}>
                  Verification code
                </label>
                <input
                  type="text"
                  id="code"
                  className={styles.input}
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={auth.isLoading}
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  New password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className={styles.input}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={auth.isLoading}
                  minLength={8}
                />
                <p className={styles.helperText}>Must be at least 8 characters</p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={auth.isLoading}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={auth.isLoading}
              >
                {auth.isLoading ? "Resetting password..." : "Reset password"}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={() => setStep("email")}
                  className={styles.footerLink}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  disabled={auth.isLoading}
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success message
  return (
    <div className={styles.splitContainer}>
      <AuthLeftPanel />
      
      <div className={styles.rightPanel}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Password reset successful!</h1>
            <p className={styles.authSubtitle}>
              Your password has been updated. Redirecting you to sign in...
            </p>
          </div>

          <div className={styles.successMessage} style={{ marginTop: "2rem" }}>
            <span>✓ {successMessage}</span>
          </div>

          <div className={styles.authFooter} style={{ marginTop: "2rem" }}>
            <p className={styles.footerText}>
              <Link href="/auth/login" className={styles.footerLink}>
                Go to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

