'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/navbar';
import Footer from '@/component/footer';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        router.push('/');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      

      <main className="  text-black flex-1 flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
          <h1 className="text-4xl font-black text-black mb-4 text-center">
            Welcome Back
          </h1>
          <p className="text-black font-semibold mb-8 text-center">
            Log in to access your personalized roadmap
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none font-semibold transition-all duration-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none font-semibold transition-all duration-300"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-black text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-black font-semibold mt-6">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-blue-600 font-bold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </main>

      
    </div>
  );
}
