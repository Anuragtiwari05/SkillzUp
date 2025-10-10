// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?topic=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight">SkillzUp</h1>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline transition">Home</a>
          <a href="#" className="hover:underline transition">About</a>
          <a href="#" className="hover:underline transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center mt-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-fadeIn">
          Learn. Explore. Grow.
        </h2>
        <p className="text-blue-800 mb-8 max-w-2xl text-lg md:text-xl animate-fadeIn delay-200">
          Discover tutorials, learning roadmaps, videos, and articles for any programming language or technology. Start your learning journey now!
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex shadow-xl rounded-lg overflow-hidden border border-blue-300 hover:border-blue-500 transition"
        >
          <input
            type="text"
            placeholder="Search for a topic..."
            className="flex-1 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg rounded-l-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-4 font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2 rounded-r-lg"
          >
            <FaSearch /> Search
          </button>
        </form>

        {/* Interactive Features / Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-fadeIn delay-400">
          <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Curated Roadmaps</h3>
            <p className="text-blue-900">Structured step-by-step guides to learn any technology efficiently.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Video Tutorials</h3>
            <p className="text-blue-900">Learn by watching practical examples from top creators and educators.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Articles & News</h3>
            <p className="text-blue-900">Stay updated with latest articles, guides, and news in tech and programming.</p>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="mt-24 bg-blue-100 rounded-xl shadow-inner p-10 max-w-5xl">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
            Start Learning Today
          </h3>
          <p className="text-blue-800 mb-6">
            Enter any topic above to instantly get a personalized learning roadmap with resources, tutorials, and more!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-blue-700 border-t border-blue-200">
        &copy; 2025 SkillzUp. All rights reserved.
      </footer>
    </div>
  );
}
