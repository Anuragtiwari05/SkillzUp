import Link from "next/link";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import FloatingChatButton from "@/component/FloatingChatButton";
import Subscription from "@/component/newSubscription";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import StatCounter from "@/component/home/StatCounter";
import CategoryTabs from "@/component/home/CategoryTabs";
import HeroLoop from "@/component/home/HeroLoop";
import RevealHeading from "@/component/motion/RevealHeading";
import SkillzUpWord from "@/component/motion/SkillzUpWord";
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
  Youtube,
} from "lucide-react";

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
  { icon: Award, value: 4.9, decimals: 1, suffix: "/5", label: "Award-winning experience" },
  { icon: Star, value: 10, decimals: 0, suffix: "K+", label: "Learning resources" },
  { icon: Users, value: 50, decimals: 0, suffix: "K+", label: "Happy learners" },
];

const ctaPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/85 transition-colors shadow-[var(--shadow-glow)]";
const ctaOutline =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto border-2 border-border text-foreground hover:border-primary hover:bg-primary/10 transition-colors";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 80% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(40% 50% at 0% 20%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <Reveal className="text-center lg:text-left">
              <p className="eyebrow text-link mb-4">Your Learning Journey Starts Here</p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-foreground leading-[1.02] mb-6">
                Master any skill with a roadmap <span className="text-link">built for you</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Structured learning paths, curated resources, and an AI assistant, all tailored to how you actually
                learn.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link href="/auth/signup" className={ctaPrimary}>
                  <Sparkles className="w-4 h-4" /> Get Started Free
                </Link>
                <Link href="/roadmaps" className={ctaOutline}>
                  <Route className="w-4 h-4" /> Browse Roadmaps
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center lg:items-start gap-1">
                    <badge.icon className="w-4 h-4 text-link" />
                    <StatCounter
                      value={badge.value}
                      decimals={badge.decimals}
                      suffix={badge.suffix}
                      label={badge.label}
                    />
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <HeroLoop />
            </Reveal>
          </div>
        </section>

        {/* Wordmark: letters drop + flip with scroll progress */}
        <section aria-label="SkillzUp" className="px-4 sm:px-6 pb-6 sm:pb-12">
          <div className="max-w-7xl mx-auto text-center font-heading font-extrabold leading-[0.9] tracking-tight text-foreground text-[clamp(3.5rem,17vw,15rem)]">
            <SkillzUpWord variant="hero" />
          </div>
        </section>

        {/* 2. WHAT WE OFFER */}
        <section className="grain py-20 sm:py-28 px-4 sm:px-6 bg-surface-elevated">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <p className="eyebrow text-link mb-3">What We Offer</p>
              <RevealHeading as="h2" className="text-3xl sm:text-5xl font-heading font-extrabold text-foreground">
                Everything you need, in one place
              </RevealHeading>
            </Reveal>

            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-24">
              {FEATURES.map((feature, idx) => (
                <Reveal key={idx} delay={idx * 0.08} className="h-full">
                  <Link href={feature.link} className="h-full block group">
                    <Card className="relative overflow-hidden p-6 sm:p-8 h-full flex flex-col items-center text-center">
                      <div
                        aria-hidden
                        className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <div className="relative bg-primary/15 border border-border w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-6">
                        <feature.icon className="w-8 h-8 text-link" />
                      </div>
                      <h3 className="relative text-lg font-heading font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="relative text-sm text-muted-foreground">{feature.desc}</p>
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
              <p className="eyebrow text-link mb-3">Explore by Category</p>
              <RevealHeading
                as="h2"
                className="text-3xl sm:text-5xl font-heading font-extrabold text-foreground mb-10"
              >
                Find your next subject
              </RevealHeading>
            </Reveal>
            <CategoryTabs />
          </div>
        </section>

        {/* 4. ALTERNATING FEATURE BLOCKS */}
        <section className="grain py-20 sm:py-28 px-4 sm:px-6 bg-surface-elevated">
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Reveal>
                <Card className="w-full aspect-[4/3] flex items-center justify-center">
                  <Clock className="w-20 h-20 text-link" />
                </Card>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow text-link mb-3">Flexible</p>
                <RevealHeading
                  as="h3"
                  className="text-2xl sm:text-4xl font-heading font-extrabold text-foreground mb-4"
                >
                  Always on your schedule
                </RevealHeading>
                <p className="text-muted-foreground leading-relaxed">
                  Generate a roadmap that fits the time you actually have, from a couple hours a week to a full-time
                  sprint, and pick it back up whenever life gets in the way.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Reveal className="lg:order-2">
                <Card className="w-full aspect-[4/3] flex items-center justify-center">
                  <Brain className="w-20 h-20 text-link" />
                </Card>
              </Reveal>
              <Reveal delay={0.1} className="lg:order-1">
                <p className="eyebrow text-link mb-3">Guided</p>
                <RevealHeading
                  as="h3"
                  className="text-2xl sm:text-4xl font-heading font-extrabold text-foreground mb-4"
                >
                  Built with AI guidance
                </RevealHeading>
                <p className="text-muted-foreground leading-relaxed">
                  Tell us your skill level and goal, and our AI assistant builds a structured plan around it, then
                  sticks around to answer questions as you work through it.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <Subscription />

        {/* 6. FINAL CTA BANNER */}
        <section className="py-10 sm:py-20 px-4 sm:px-6">
          <Reveal>
            <div className="grain relative max-w-4xl mx-auto overflow-hidden bg-primary text-primary-foreground rounded-[2rem] px-6 sm:px-16 py-16 text-center">
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold mb-4">
                Ready to start learning with a plan?
              </h2>
              <p className="mb-8 max-w-xl mx-auto font-medium">
                Join for free and generate your first personalized roadmap in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto bg-primary-foreground text-primary hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/roadmaps"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold text-base w-full sm:w-auto border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
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
