'use client';

import Link from "next/link";
import styles from './EmailVerification.module.css'; 

export default function EmailVerification() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Email Verification</h1>
            <Link href={'/login'} className={styles.link}>Login</Link>
        </div>
    );
}