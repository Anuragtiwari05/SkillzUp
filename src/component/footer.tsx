// src/components/Footer.tsx
"use client";

import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-white">SkillzUp</span>
            </div>
            <p className="text-white leading-relaxed font-semibold text-sm sm:text-base">
              Your ultimate learning companion. We provide structured roadmaps, curated resources, 
              and the latest updates for any skill you want to master.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a
                  href="#about"
                  className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                >
                  <span>→</span>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                >
                  <span>→</span>
                  <span>How It Works</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                >
                  <span>→</span>
                  <span>Popular Courses</span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                >
                  <span>→</span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Our Mission</h3>
            <p className="text-white leading-relaxed font-semibold text-sm sm:text-base">
              We believe learning should be accessible, structured, and personalized. 
              Our platform aggregates the best educational content from across the web 
              to create your perfect learning journey.
            </p>
            <div className="pt-4">
              <p className="text-white text-sm font-bold">
                Making education accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-sm sm:text-base">
          <p className="text-white font-bold">
            &copy; 2025 SkillzUp. Built with passion for learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
