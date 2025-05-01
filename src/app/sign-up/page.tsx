'use client';

import Image from 'next/image';
import styles from './page.module.css';
import "./../fonts.scss";
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      const script = document.querySelector(
        `script[src="https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}"]`
      );
      if (script) {
        script.remove();
      }
      if (typeof window !== 'undefined') {
        delete (window as any).grecaptcha;
      }
    };
  }, []);

  const handleSignUp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        setError('The passwords do not match');
        return;
      }

      try {
        // Проверяем наличие window и grecaptcha
        if (typeof window === 'undefined' || !window.grecaptcha) {
          throw new Error('reCAPTCHA не загружен');
        }

        // Получение токена reCAPTCHA
        const recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string, {
                action: 'signup',
              })
              .then((token) => resolve(token))
              .catch(reject);
          });
        });

        // Отправка данных на сервер
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, recaptchaToken }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          router.push('/');
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('reCAPTCHA error or server error');
      }
    },
    [email, password, confirmPassword, router]
  );

  const handleGoogleSignUp = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
        onLoad={() => setRecaptchaLoaded(true)}
        onError={() => setError('Ошибка загрузки reCAPTCHA')}
      />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.logo} onClick={() => router.push('/')}>
              <Image src="/pictures/logo.svg" alt="Logo" width={30} height={30} />{' '}
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

                  <div
                    className={styles.button}
                    onClick={() => formRef.current?.requestSubmit()}
                  >
                    <span>Continue</span>
                  </div>
                </form>
                <div className={styles.google} onClick={handleGoogleSignUp}>
                  <Image
                    src="/pictures/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Continue with Google</span>
                </div>
                <p className={styles.signup}>
                  Already have an account? <a href="/sign-in">Sign in</a>
                </p>
              </div>
              <div className={styles.warning}>
                By continuing, you agree to Pixelmate's{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </div>
            </div>
            <div className={styles.right}></div>
          </div>
        </main>
      </div>
    </>
  );
}