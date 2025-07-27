"use client";
import { useState } from 'react'
import styles from './styles/Navbar.module.css'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function Navbar({ isLoggedIn = false }) {
        const [dropdownOpen, setDropdownOpen] = useState(false)

        const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

        const handleLogout = () => {
        Cookies.remove("access_token")
        Cookies.remove("access_token_expiry")
        console.log('Logging out...')
        setDropdownOpen(false)
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

      {/*<div className={styles.center}>
        <Link href="/pricing" className={styles.link}>
          Pricing
        </Link>
      </div>*/}
            
      <div className={styles.right}>
        {!isLoggedIn ? (
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
              <img src="/avatar.svg" alt="Profile" className={styles.avatar} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link href="/profile">Profile</Link>
                <Link href="/transactions">Transactions</Link>
                <Link href="/history">History</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
