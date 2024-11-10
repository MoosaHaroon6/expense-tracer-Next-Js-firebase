'use client';

import Link from "next/link";
import styles from './Root.module.css';

export default function Root() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Trace Your Expenses!</h1>
      <p className={styles.description}>Sign in or create an account to get started.</p>
      <Link href={'/login'} className={styles.link}>Login</Link>
      <br />
      <Link href={'/signup'} className={styles.link}>Sign Up</Link>
    </div>
  )
}
