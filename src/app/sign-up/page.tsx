'use client';

import Image from "next/image";
import styles from "./page.module.css";
import "./../fonts.scss";
import { useRef, useState, useEffect, StrictMode } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('The passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                router.push('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Server error');
        }
    };

    const handleGoogleSignUp = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.logo} onClick={() => router.push('/')}>
                        <Image
                            src="/pictures/logo.svg"
                            alt="Logo"
                            width={30}
                            height={30} />
                        <span>pixelmate</span>
                    </div>
                    <div className={styles.left}>
                        <div className={styles.content}>
                            <p className={styles.title}>Hi, there 👋</p>

                            <form ref={formRef} onSubmit={handleSignUp}>
                                <p className={styles.label}>Email address</p>
                                <input
                                    type="email"
                                    spellCheck="false"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <p className={styles.label}>Password</p>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                    required
                                />

                                <p className={styles.label}>Confirm password</p>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={8}
                                    required
                                />

                                {error && <p className={styles.error}>{error}</p>}

                                <div className={styles.button} onClick={() => formRef.current?.requestSubmit()}><span>Continue</span></div>
                            </form>
                            <div className={styles.google} onClick={handleGoogleSignUp}>
                                <Image
                                    src="/pictures/google.svg"
                                    alt="Google"
                                    width={20}
                                    height={20} />
                                <span>Continue with Google</span>
                            </div>
                            <p className={styles.signup}>Already have an account? <a href="/sign-in">Sign in</a></p>
                        </div>
                        <div className={styles.warning}>By continuing, you agree to Pixelmate's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></div>
                    </div>
                    <div className={styles.right}>

                    </div>
                </div>
            </main>
        </div>
    );
}