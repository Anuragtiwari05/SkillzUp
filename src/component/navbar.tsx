"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Search } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if JWT token exists
    setIsLoggedIn(document.cookie.includes("token"));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // ✅ Navigate to the search results page
    router.push(`/search?topic=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e as any);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    window.location.href = "/signup";
  };

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">SkillzUp</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for any course (e.g., Python, React, Machine Learning)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-6 py-3 pl-12 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md text-black font-semibold"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black transition-colors" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 hover:shadow-lg font-bold"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              Home
            </Link>
            <Link href="#about" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              About
            </Link>
            <Link href="#contact" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              Contact
            </Link>

            {/* Dynamic Sign Up / Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-bold"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
