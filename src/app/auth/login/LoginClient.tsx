'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/component/navbar';
import Footer from '@/component/footer';
import Button from '@/component/ui/Button';
import Card from '@/component/ui/Card';
import Reveal from '@/component/ui/Reveal';

export default function LoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        router.push(redirect);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4">
        <Reveal>
          <Card hover={false} className="w-full max-w-sm sm:max-w-md p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3 text-center">
              Welcome Back
            </h1>

            <p className="text-neutral-600 font-medium text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Log in to access your personalized roadmap
            </p>

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-neutral-200
                           focus:border-primary-500 focus:outline-none font-medium
                           text-sm sm:text-base transition-all duration-300 text-neutral-900"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-neutral-200
                           focus:border-primary-500 focus:outline-none font-medium
                           text-sm sm:text-base transition-all duration-300 text-neutral-900"
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-neutral-600 font-medium mt-5 sm:mt-6 text-sm sm:text-base">
              Don&apos;t have an account?{' '}
              <a
                href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
                className="text-primary-700 font-bold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </Card>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
