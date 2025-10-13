// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import { BookOpen, Search } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Searching for:", query);
    // Add your search logic or router navigation here
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
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
            <span className="text-2xl font-bold text-black">
              SkillzUp
            </span>
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
                  onKeyPress={handleKeyPress}
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
            <a href="/" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              Home
            </a>
            <a href="#about" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              About
            </a>
            <a href="#contact" className="text-black hover:text-blue-600 transition-colors duration-300 font-bold">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
