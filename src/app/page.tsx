"use client";

import Link from "next/link";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import FloatingChatButton from "@/component/FloatingChatButton";
import Subscription from "@/component/newSubscription";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import StatCounter from "@/component/home/StatCounter";
import CategoryTabs from "@/component/home/CategoryTabs";
import TestimonialCarousel from "@/component/home/TestimonialCarousel";
import HeroLoop from "@/component/home/HeroLoop";
import {
  Map,
  FileText,
  TrendingUp,
  Sparkles,
  Award,
  Star,
  Users,
  Clock,
  Brain,
  Route,
} from "lucide-react";
import { Youtube } from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "Structured Roadmap",
    desc: "Step-by-step learning paths tailored to your goals",
    link: "/features/roadmap",
  },
  {
    icon: Youtube,
    title: "Best Channels",
    desc: "Curated video content from top educators",
    link: "/features/yt",
  },
  {
    icon: FileText,
    title: "Expert Articles",
    desc: "In-depth tutorials and comprehensive guides",
    link: "/features/article",
  },
  {
    icon: TrendingUp,
    title: "Latest News",
    desc: "Stay updated with industry trends and updates",
    link: "/features/news",
  },
];

const TRUST_BADGES = [
  { icon: Award, value: 4, suffix: ".9/5", label: "Award-winning experience" },
  { icon: Star, value: 10, suffix: "K+", label: "Learning resources" },
  { icon: Users, value: 50, suffix: "K+", label: "Happy learners" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal className="text-center lg:text-left">
              <p className="eyebrow text-primary-600 mb-4">Your Learning Journey Starts Here</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-neutral-900 leading-[1.05] mb-6">
                Master Any Skill with a Roadmap Built For You
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Structured learning paths, curated resources, and an AI assistant —
                all tailored to how you actually learn.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-[0_10px_24px_-8px_rgba(47,111,237,0.55)]"
                >
                  <Sparkles className="w-4 h-4" /> Get Started Free
                </Link>
                <Link
                  href="/roadmaps"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto border-2 border-neutral-200 text-neutral-900 hover:border-primary-400 transition-colors"
                >
                  <Route className="w-4 h-4" /> Browse Roadmaps
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center lg:items-start gap-1">
                    <badge.icon className="w-4 h-4 text-primary-600" />
                    <StatCounter value={badge.value} suffix={badge.suffix} label={badge.label} />
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <HeroLoop />
            </Reveal>
          </div>
        </section>

        {/* 2. WHAT WE OFFER */}
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: "var(--color-tint-blue)" }}>
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <p className="eyebrow text-primary-600 mb-3">What We Offer</p>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-neutral-900">
                Everything you need, in one place
              </h2>
            </Reveal>

            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-24">
              {FEATURES.map((feature, idx) => (
                <Reveal key={idx} delay={idx * 0.08} className="h-full">
                  <Link href={feature.link} className="h-full block">
                    <Card className="p-6 sm:p-8 h-full flex flex-col items-center text-center">
                      <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                        <feature.icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-neutral-600">{feature.desc}</p>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CATEGORY TABS */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-4">
              <p className="eyebrow text-primary-600 mb-3">Explore by Category</p>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-neutral-900 mb-10">
                Find your next subject
              </h2>
            </Reveal>
            <CategoryTabs />
          </div>
        </section>

        {/* 4. ALTERNATING FEATURE BLOCKS */}
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: "var(--color-tint-peach)" }}>
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Reveal>
                <div className="w-full aspect-[4/3] bg-surface rounded-3xl shadow-[var(--shadow-card)] flex items-center justify-center">
                  <Clock className="w-20 h-20 text-primary-600" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow text-primary-600 mb-3">Flexible</p>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-neutral-900 mb-4">
                  Always on your schedule
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Generate a roadmap that fits the time you actually have — from a
                  couple hours a week to a full-time sprint — and pick it back up
                  whenever life gets in the way.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Reveal className="lg:order-2">
                <div className="w-full aspect-[4/3] bg-surface rounded-3xl shadow-[var(--shadow-card)] flex items-center justify-center">
                  <Brain className="w-20 h-20 text-primary-600" />
                </div>
              </Reveal>
              <Reveal delay={0.1} className="lg:order-1">
                <p className="eyebrow text-primary-600 mb-3">Guided</p>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-neutral-900 mb-4">
                  Built with AI guidance
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Tell us your skill level and goal, and our AI assistant builds a
                  structured plan around it — then sticks around to answer
                  questions as you work through it.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <Subscription />

        {/* 5. TESTIMONIALS */}
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: "var(--color-tint-green)" }}>
          <Reveal className="text-center mb-14">
            <p className="eyebrow text-primary-600 mb-3">Loved by learners</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-neutral-900">
              Students and mentors love SkillzUp
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <TestimonialCarousel />
          </Reveal>
        </section>

        {/* 6. FINAL CTA BANNER */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <Reveal>
            <div className="max-w-4xl mx-auto bg-ink rounded-[2rem] px-6 sm:px-16 py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4">
                Ready to start learning with a plan?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join for free and generate your first personalized roadmap in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto bg-primary-500 text-white hover:bg-primary-400 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/roadmaps"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Browse Roadmaps
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />

      <FloatingChatButton />
    </div>
  );
}
