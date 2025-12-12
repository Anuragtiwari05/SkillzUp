'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="text-black min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md p-8 sm:p-10">

          <h1 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4 text-center">
            Create Your Account
          </h1>

          <p className="text-black font-semibold text-center mb-6 sm:mb-8 text-sm sm:text-base">
            Join SkillzUp and start your learning journey
          </p>

          <form onSubmit={handleSignup} className="space-y-5 sm:space-y-6 text-black">

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-blue-300 
                         focus:border-blue-500 focus:outline-none font-semibold 
                         text-sm sm:text-base transition-all duration-300"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-blue-300 
                         focus:border-blue-500 focus:outline-none font-semibold 
                         text-sm sm:text-base transition-all duration-300"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-blue-300 
                         focus:border-blue-500 focus:outline-none font-semibold 
                         text-sm sm:text-base transition-all duration-300"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 rounded-full border-2 border-blue-300 
                         focus:border-blue-500 focus:outline-none font-semibold 
                         text-sm sm:text-base transition-all duration-300"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-black 
                         text-base sm:text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-black font-semibold mt-5 sm:mt-6 text-sm sm:text-base">
            Already have an account?{' '}
            <a href="/auth/login" className="text-blue-600 font-bold hover:underline">
              Login
            </a>
          </p>

        </div>
      </main>

    </div>
  );
}
