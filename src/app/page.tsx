'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Map, Youtube, FileText, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?topic=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?topic=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-600 px-5 py-2 rounded-full font-bold mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-black">Your Learning Journey Starts Here</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-black leading-tight">
              Master Any Skill with
              <span className="text-blue-600"> Personalized Roadmaps</span>
            </h1>
            
            <p className="text-2xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
              Get structured learning paths, curated YouTube channels, expert articles, and trending news — all tailored to accelerate your growth
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => document.querySelector('input')?.focus()}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              { 
                icon: Map, 
                title: 'Structured Roadmap', 
                desc: 'Step-by-step learning paths tailored to your goals',
                color: 'bg-blue-100', 
                iconColor: 'text-blue-600',
                borderColor: 'border-blue-300'
              },
              { 
                icon: Youtube, 
                title: 'Best Channels', 
                desc: 'Curated video content from top educators',
                color: 'bg-red-100', 
                iconColor: 'text-red-600',
                borderColor: 'border-red-300'
              },
              { 
                icon: FileText, 
                title: 'Expert Articles', 
                desc: 'In-depth tutorials and comprehensive guides',
                color: 'bg-green-100', 
                iconColor: 'text-green-600',
                borderColor: 'border-green-300'
              },
              { 
                icon: TrendingUp, 
                title: 'Latest News', 
                desc: 'Stay updated with industry trends and updates',
                color: 'bg-purple-100', 
                iconColor: 'text-purple-600',
                borderColor: 'border-purple-300'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border-4 ${feature.borderColor}`}
              >
                <div className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-black text-black mb-2">{feature.title}</h3>
                <p className="text-black text-base font-semibold">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10K+', label: 'Learning Resources' },
              { number: '500+', label: 'Topics Covered' },
              { number: '50K+', label: 'Happy Learners' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-300">
                <div className="text-5xl md:text-6xl font-black text-blue-600 mb-2">{stat.number}</div>
                <div className="text-black text-xl font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-white">SkillzUp</span>
              </div>
              <p className="text-white leading-relaxed font-semibold">
                Your ultimate learning companion. We provide structured roadmaps, curated resources, and the latest updates for any skill you want to master.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold">
                    <span>→</span>
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold">
                    <span>→</span>
                    <span>How It Works</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold">
                    <span>→</span>
                    <span>Popular Courses</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold">
                    <span>→</span>
                    <span>Contact</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-white leading-relaxed font-semibold">
                We believe learning should be accessible, structured, and personalized. Our platform aggregates the best educational content from across the web to create your perfect learning journey.
              </p>
              <div className="pt-4">
                <p className="text-white text-sm font-bold">Making education accessible to everyone, everywhere.</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-700 mt-8 pt-8 text-center">
            <p className="text-white font-bold">&copy; 2025 SkillzUp. Built with passion for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}