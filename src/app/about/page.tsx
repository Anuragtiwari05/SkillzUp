'use client';

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black text-black mb-6">About SkillzUp</h1>
        <p className="text-xl text-black leading-relaxed mb-4">
          SkillzUp is a platform designed to accelerate your learning journey. 
          We provide personalized learning roadmaps, curated video content, expert articles, 
          and trending industry news—all in one place.
        </p>
        <p className="text-xl text-black leading-relaxed mb-4">
          Our goal is to help learners of all levels master new skills efficiently 
          and stay updated with the latest trends in technology, development, and education.
        </p>
        <p className="text-xl text-black leading-relaxed">
          Join thousands of learners who trust SkillzUp for their skill growth and career development.
        </p>
      </main>

      <Footer />
    </div>
  );
}
