"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/CustomAuth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLeftPanel from "./AuthLeftPanel";
import { useAuth } from "@/store/hooks/useAuth";

const CustomSignIn = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle email/password sign in
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await auth.signIn({ email, password });
      router.push("/");
    } catch (err) {
      // Error is already handled in the store
      console.error("Sign in error:", err);
    }
  };

  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider: "google" | "apple" | "linkedin_oidc") => {
    try {
      await auth.signInWithOAuth({
        provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("OAuth sign in error:", err);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* <AuthLeftPanel /> */}
      
      <div className={styles.rightPanel}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Welcome back</h1>
            <p className={styles.authSubtitle}>Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {auth.error && (
            <div className={styles.errorMessage}>
              <span>⚠️ {auth.error.message}</span>
            </div>
          )}

          {/* CAPTCHA Element - Required by Clerk */}
          <div id="clerk-captcha" />

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
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
              <div className={styles.labelRow}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Link href="/auth/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
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
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={auth.isLoading}
            >
              {auth.isLoading ? "Signing in..." : "Sign in"}
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
              onClick={() => handleOAuthSignIn("google")}
              disabled={auth.isLoading}
            >
              <FcGoogle className={styles.oauthIcon} />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignIn("apple")}
              disabled={auth.isLoading}
            >
              <FaApple className={styles.oauthIcon} />
              <span>Continue with Apple</span>
            </button>

            <button
              type="button"
              className={styles.oauthButton}
              onClick={() => handleOAuthSignIn("linkedin_oidc")}
              disabled={auth.isLoading}
            >
              <FaLinkedin className={styles.oauthIcon} style={{ color: "#0077B5" }} />
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className={styles.authFooter}>
            <p className={styles.footerText}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className={styles.footerLink}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSignIn;

