"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '1rem',
        }}>
          <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
            ⏳
          </div>
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Completing sign in...
        </h2>
        <p style={{ opacity: 0.9 }}>
          Please wait while we redirect you
        </p>
      </div>
      <AuthenticateWithRedirectCallback />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

