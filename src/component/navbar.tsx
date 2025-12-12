"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, X, Search } from "lucide-react";

interface NavbarProps {
  onSearch?: (searchQuery: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        const data = await res.json();
        setIsLoggedIn(data.success === true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) onSearch(query.trim());
    else router.push(`/search?topic=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setIsLoggedIn(false);
      router.push("/auth/login");
    } catch {}
  };

  if (loading) return null;

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-1 cursor-pointer flex-shrink-0"
            onClick={() => router.push("/")}
          >
            <div className="bg-blue-600 p-1.5 rounded-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-black hidden sm:inline">SkillzUp</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-4 max-w-xl sm:max-w-2xl">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-black text-sm sm:text-base shadow-sm"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-all duration-300 flex items-center text-sm sm:text-base"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <Link href="/" className="text-black hover:text-blue-600 font-medium">Home</Link>
            <Link href="/about" className="text-black hover:text-blue-600 font-medium">About</Link>
            <Link href="/contact" className="text-black hover:text-blue-600 font-medium">Contact</Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 px-2">
            <Link href="/" className="block text-black hover:text-blue-600 font-medium">Home</Link>
            <Link href="/about" className="block text-black hover:text-blue-600 font-medium">About</Link>
            <Link href="/contact" className="block text-black hover:text-blue-600 font-medium">Contact</Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium w-full"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium w-full"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
