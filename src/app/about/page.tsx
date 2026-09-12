'use client';

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full">
        <Reveal>
          <p className="eyebrow text-primary-600 mb-3 text-center sm:text-left">About Us</p>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-neutral-900 mb-8 text-center sm:text-left">
            About SkillzUp
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <Card hover={false} className="p-6 sm:p-10 space-y-5">
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              SkillzUp is a platform designed to accelerate your learning journey.
              We provide personalized learning roadmaps, curated video content, expert articles,
              and trending industry news—all in one place.
            </p>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              Our goal is to help learners of all levels master new skills efficiently
              and stay updated with the latest trends in technology, development, and education.
            </p>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              Join thousands of learners who trust SkillzUp for their skill growth and career development.
            </p>
          </Card>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
