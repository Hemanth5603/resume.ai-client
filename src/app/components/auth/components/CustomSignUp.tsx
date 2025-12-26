"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/CustomAuth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLeftPanel from "./AuthLeftPanel";
import { useAuth } from "@/store/hooks/useAuth";

const CustomSignUp = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle email/password sign up
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await auth.signUp({ 
        email, 
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  // Handle verification code submission
  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await auth.verifyEmail({ code });
      router.push("/");
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  // Handle OAuth sign up
  const handleOAuthSignUp = async (provider: "google" | "apple" | "linkedin_oidc") => {
    try {
      await auth.signInWithOAuth({
        provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("OAuth sign up error:", err);
    }
  };

  // Verification form
  if (auth.pendingVerification) {
    return (
      <div className={styles.splitContainer}>
        <AuthLeftPanel />
        
        <div className={styles.rightPanel}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Verify your email</h1>
              <p className={styles.authSubtitle}>
                We&apos;ve sent a verification code to <strong>{email}</strong>
              </p>
            </div>

            {auth.error && (
              <div className={styles.errorMessage}>
                <span>⚠️ {auth.error.message}</span>
              </div>
            )}

            <form onSubmit={handleVerification} className={styles.authForm}>
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
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={auth.isLoading}
              >
                {auth.isLoading ? "Verifying..." : "Verify email"}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={() => {/* Resend handled by auth service */}}
                  className={styles.footerLink}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign up form
  return (
    <div className={styles.splitContainer}>
      <AuthLeftPanel />
      
      <div className={styles.rightPanel}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Create your account</h1>
            <p className={styles.authSubtitle}>Get started with Resume.ai today</p>
          </div>

          {/* Error Message */}
          {auth.error && (
            <div className={styles.errorMessage}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span>⚠️ {auth.error.message}</span>
              </div>
              {auth.error.field && (
                <div style={{ fontSize: '0.75rem', color: '#e53e3e', opacity: 0.8 }}>
                  Field: {auth.error.field}
                </div>
              )}
            </div>
          )}

          {/* CAPTCHA Element - Required by Clerk */}
          <div id="clerk-captcha" />

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className={styles.input}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={auth.isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className={styles.input}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={auth.isLoading}
                />
              </div>
            </div>

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
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={auth.isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={auth.isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className={styles.helperText}>Must be at least 8 characters</p>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={auth.isLoading}
            >
              {auth.isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>Or continue with</span>
          </div>

          {/* OAuth Buttons */}
          <div className={styles.oauthContainer}>
            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignUp("google")}
              disabled={auth.isLoading}
            >
              <FcGoogle className={styles.oauthIcon} />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignUp("apple")}
              disabled={auth.isLoading}
            >
              <FaApple className={styles.oauthIcon} />
              <span>Continue with Apple</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignUp("linkedin_oidc")}
              disabled={auth.isLoading}
            >
              <FaLinkedin className={styles.oauthIcon} style={{ color: "#0077B5" }} />
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className={styles.authFooter}>
            <p className={styles.footerText}>
              Already have an account?{" "}
              <Link href="/auth/login" className={styles.footerLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSignUp;
