'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Map, Youtube, FileText, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/component/navbar';
import Footer from '@/component/footer';

export default function HomePage(): JSX.Element {
  const router = useRouter();

  // ✅ Handle search navigation (called from Navbar)
  const handleSearch = (searchQuery: string): void => {
    if (searchQuery && searchQuery.trim() !== '') {
      router.push(`/search?topic=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: Map,
      title: 'Structured Roadmap',
      desc: 'Step-by-step learning paths tailored to your goals',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-300',
    },
    {
      icon: Youtube,
      title: 'Best Channels',
      desc: 'Curated video content from top educators',
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-300',
    },
    {
      icon: FileText,
      title: 'Expert Articles',
      desc: 'In-depth tutorials and comprehensive guides',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-300',
    },
    {
      icon: TrendingUp,
      title: 'Latest News',
      desc: 'Stay updated with industry trends and updates',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-300',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Learning Resources' },
    { number: '500+', label: 'Topics Covered' },
    { number: '50K+', label: 'Happy Learners' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar supports onSearch */}
      <Navbar onSearch={handleSearch} />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-600 px-5 py-2 rounded-full font-bold mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white">Your Learning Journey Starts Here</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-black leading-tight">
              Master Any Skill with
              <span className="text-blue-600"> Personalized Roadmaps</span>
            </h1>

            <p className="text-2xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
              Get structured learning paths, curated YouTube channels, expert articles, and trending news — all tailored to accelerate your growth.
            </p>

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
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border-4 ${feature.borderColor}`}
              >
                <div
                  className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-black text-black mb-2">{feature.title}</h3>
                <p className="text-black text-base font-semibold">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-300"
              >
                <div className="text-5xl md:text-6xl font-black text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-black text-xl font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
