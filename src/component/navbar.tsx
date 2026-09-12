"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/auth/login");
      router.refresh();
    } catch {}
  };

  if (loading) return <div className="h-16 bg-surface border-b border-surface-border" />;

  return (
    <nav className="bg-surface/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            onClick={() => router.push("/")}
          >
            <div className="bg-primary-600 p-1.5 rounded-full">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-neutral-900 hidden sm:inline">SkillzUp</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <Link href="/" className="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">Home</Link>
            <Link href="/roadmaps" className="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">Roadmaps</Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">About</Link>
            <Link href="/contact" className="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">Contact</Link>
            {isLoggedIn && (
              <Link href="/dashboard" className="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">Dashboard</Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors duration-300 font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors duration-300 font-bold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-neutral-900 p-2 rounded-md hover:bg-neutral-100 transition-all duration-300"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-2 px-2">
            <Link href="/" className="block text-neutral-700 hover:text-primary-600 font-semibold py-1">Home</Link>
            <Link href="/roadmaps" className="block text-neutral-700 hover:text-primary-600 font-semibold py-1">Roadmaps</Link>
            <Link href="/about" className="block text-neutral-700 hover:text-primary-600 font-semibold py-1">About</Link>
            <Link href="/contact" className="block text-neutral-700 hover:text-primary-600 font-semibold py-1">Contact</Link>
            {isLoggedIn && (
              <Link href="/dashboard" className="block text-neutral-700 hover:text-primary-600 font-semibold py-1">Dashboard</Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors duration-300 font-bold w-full mt-2"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="block bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors duration-300 font-bold w-full mt-2 text-center"
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
