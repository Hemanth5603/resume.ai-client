"use client";
import { useState } from "react";
import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { useUserFromStore } from "@/store";

export default function Navbar() {
  const { isSignedIn, user } = useUserFromStore();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = () => {
    signOut(() => {
      window.location.href = "/";
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            resume.ai
          </Link>
        </div>

        <div className={styles.right}>
          <div className={styles.center}>
            <Link href="/pricing" className={styles.link}>
              Pricing
            </Link>
            <Link href="/reviews" className={styles.link}>
              Reviews
            </Link>
          </div>

          {!isSignedIn ? (
            <Link href="/auth/login" className={styles.loginButton}>
              Login
            </Link>
          ) : (
            <div className={styles.profileWrapper}>
              <button onClick={toggleDropdown} className={styles.profileButton}>
                <Image
                  src={user?.imageUrl || "/avatar.svg"}
                  alt="User avatar"
                  className={styles.avatar}
                  width={40}
                  height={40}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link href="/dashboard/profile">Profile</Link>
                  <Link href="/transactions">Transactions</Link>
                  <Link href="/history">History</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
