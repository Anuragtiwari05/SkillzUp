'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaBookOpen, FaLaptopCode, FaGraduationCap } from 'react-icons/fa';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?topic=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <motion.h1
          className="text-2xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SkillzUp
        </motion.h1>
        <div className="hidden md:flex space-x-8 text-lg">
          <a href="/" className="hover:text-blue-200 transition">Home</a>
          <a href="#" className="hover:text-blue-200 transition">Courses</a>
          <a href="#" className="hover:text-blue-200 transition">About</a>
          <a href="#" className="hover:text-blue-200 transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Empower Your Learning Journey
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Access roadmaps, tutorials, videos, and resources for every skill — all in one place.
          Whether you’re a beginner or advanced learner, SkillzUp guides your growth.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex shadow-2xl rounded-xl overflow-hidden border border-blue-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search for a topic, e.g. React, AI, Cloud Computing..."
            className="flex-1 px-6 py-4 text-lg focus:outline-none text-black bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-4 font-semibold hover:bg-blue-800 transition-all flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </motion.form>
      </section>

      {/* Key Highlights Section */}
      <section className="mt-16 px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {[
          {
            icon: <FaGraduationCap className="text-blue-700 text-4xl" />,
            title: 'Guided Roadmaps',
            desc: 'Structured step-by-step learning paths to master any skill efficiently.'
          },
          {
            icon: <FaBookOpen className="text-blue-700 text-4xl" />,
            title: 'Curated Tutorials',
            desc: 'Handpicked content from trusted educators to enhance your learning.'
          },
          {
            icon: <FaLaptopCode className="text-blue-700 text-4xl" />,
            title: 'Practical Projects',
            desc: 'Learn by doing — build real-world projects and strengthen your portfolio.'
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white border border-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">{item.title}</h3>
            <p className="text-gray-700">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Animated CTA Section */}
      <motion.section
        className="mt-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 text-center rounded-t-3xl shadow-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Start Learning Smarter Today
        </h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
          Explore personalized resources and interactive roadmaps crafted to guide your learning journey with precision.
        </p>
        <a
          href="#"
          className="bg-white text-blue-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-100 transition"
        >
          Get Started
        </a>
      </motion.section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 mt-16 py-12 px-8 text-center md:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-3 text-white">SkillzUp</h4>
            <p className="text-blue-200">
              A next-generation platform empowering learners with AI-curated tutorials,
              structured roadmaps, and real-time educational resources.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Courses</a></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-3 text-white">Stay Connected</h4>
            <p className="text-blue-200">
              Join our community and stay updated with the latest learning resources and AI trends.
            </p>
          </div>
        </div>
        <div className="text-center mt-10 text-blue-300 text-sm">
          © 2025 SkillzUp. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
