"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './LoginAndSignup.module.css';
import { signupWithEmailPassword } from "@/firebase/firebaseAuth";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const signupHandler = async () => {
        setNotification({ message: '', error: false });
        setLoading(true);

        if (!validateEmail(email)) {
            setNotification({ message: 'Invalid email format.', error: true });
            setLoading(false);
            return;
        }

        try {
            await signupWithEmailPassword(email, password);
            setNotification({ message: 'A verification email has been sent to your email address. Please verify before logging in.', error: false });
            setEmail('');
            setPassword('');
            router.push('/emailverification');
        } catch (error) {
            setNotification({ error: true, message: 'falied to signup' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Sign Up</h1>

            {notification.message && (
                <p className={notification.error ? styles.error : styles.success}>
                    {notification.message}
                </p>
            )}

            <label className={styles.label}>Email:
                <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <br />

            <label className={styles.label}>Password:
                <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <br />
            <button className={styles.button} onClick={signupHandler} disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <br />
            <span>Already have an account?</span>
            <Link href={'/login'} className={styles.link}>Login</Link>
        </div>
    );
}