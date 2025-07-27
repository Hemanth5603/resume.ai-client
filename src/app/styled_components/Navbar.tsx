"use client";
import { useState } from 'react'
import styles from './styles/Navbar.module.css'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useClerk, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const {isSignedIn, user} = useUser()
  const {signOut} = useClerk()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const handleLogout = () => {
      signOut(() => {
      window.location.href="/"
    })
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          Resume.ai
        </Link>
        <Link href="/pricing" className={styles.link}>
          Pricing
        </Link>
      </div>

      <div className={styles.right}>
        {!isSignedIn ? (
          <>
          <Link href="/auth/login" className={styles.loginButton}>
          Login
          </Link>
          <Link href="/auth/signup" className={styles.signupButton}>
          Sign Up
          </Link>
          </>
        ) : (
          <div className={styles.profileWrapper}>
            <button onClick={toggleDropdown} className={styles.profileButton}>
              <img src={user.imageUrl} alt="/avatar.svg" className={styles.avatar} />
            </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/profile">Profile</Link>
              <Link href="/transactions">Transactions</Link>
              <Link href="/history">History</Link>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
          </div>
        )}
      </div>
    </nav>
  )
}
