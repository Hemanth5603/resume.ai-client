"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/CustomAuth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLeftPanel from "./AuthLeftPanel";

const CustomSignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle email/password sign up
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting sign up with:", {
        emailAddress: email,
        firstName,
        lastName,
        hasPassword: !!password
      });

      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      });

      console.log("Sign up successful, status:", signUpAttempt.status);

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      console.error("Sign up error details:", err);
      const error = err as { 
        errors?: Array<{ 
          message: string; 
          longMessage?: string; 
          code?: string;
          meta?: { paramName?: string }
        }> 
      };
      
      // Get more detailed error message
      const errorDetail = error.errors?.[0];
      let errorMessage = "Failed to sign up. Please try again.";
      
      if (errorDetail) {
        errorMessage = errorDetail.longMessage || errorDetail.message || errorMessage;
        console.error("Clerk error code:", errorDetail.code);
        console.error("Clerk error message:", errorDetail.message);
        console.error("Clerk error param:", errorDetail.meta?.paramName);
        
        // Add param name to error message if available
        if (errorDetail.meta?.paramName) {
          errorMessage = `${errorMessage} (Field: ${errorDetail.meta.paramName})`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth sign up
  const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_apple" | "oauth_linkedin") => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || "Failed to sign up with OAuth.");
    }
  };

  // Verification form
  if (pendingVerification) {
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

            {error && (
              <div className={styles.errorMessage}>
                <span>⚠️ {error}</span>
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
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify email"}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={() => signUp?.prepareEmailAddressVerification({ strategy: "email_code" })}
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
          {error && (
            <div className={styles.errorMessage}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span>⚠️ {error}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#e53e3e', opacity: 0.8 }}>
                Check browser console for more details
              </div>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
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
              onClick={() => handleOAuthSignUp("oauth_google")}
              disabled={isLoading}
            >
              <FcGoogle className={styles.oauthIcon} />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignUp("oauth_apple")}
              disabled={isLoading}
            >
              <FaApple className={styles.oauthIcon} />
              <span>Continue with Apple</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignUp("oauth_linkedin")}
              disabled={isLoading}
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
