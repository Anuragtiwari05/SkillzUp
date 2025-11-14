"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import FloatingChatButton from "@/component/FloatingChatButton";
import {
  Map,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { YoutubeIcon } from "lucide-react";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";

export default function HomePage() {
  const router = useRouter();

  // ✅ Handle search navigation (called from Navbar)
  const handleSearch = (searchQuery: string): void => {
    if (searchQuery && searchQuery.trim() !== "") {
      router.push(`/search?topic=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: Map,
      title: "Structured Roadmap",
      desc: "Step-by-step learning paths tailored to your goals",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300",
      link: "/features/roadmap",
    },
    {
      icon: YoutubeIcon,
      title: "Best Channels",
      desc: "Curated video content from top educators",
      color: "bg-red-100",
      iconColor: "text-red-600",
      borderColor: "border-red-300",
      link: "/features/yt",
    },
    {
      icon: FileText,
      title: "Expert Articles",
      desc: "In-depth tutorials and comprehensive guides",
      color: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-300",
      link: "/features/article",
    },
    {
      icon: TrendingUp,
      title: "Latest News",
      desc: "Stay updated with industry trends and updates",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-300",
      link: "/features/news",
    },
  ];

  const stats = [
    { number: "10K+", label: "Learning Resources" },
    { number: "500+", label: "Topics Covered" },
    { number: "50K+", label: "Happy Learners" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ✅ Navbar supports onSearch */}
      <Navbar onSearch={handleSearch} />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-600 px-5 py-2 rounded-full font-bold mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white">
                Your Learning Journey Starts Here
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-black leading-tight">
              Master Any Skill with
              <span className="text-blue-600"> Personalized Roadmaps</span>
            </h1>

            <p className="text-2xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
              Get structured learning paths, curated YouTube channels, expert
              articles, and trending news — all tailored to accelerate your
              growth.
            </p>
          </div>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, idx) => (
              <Link href={feature.link || "#"} key={idx} className="h-full">
                <div
                  className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border-4 ${feature.borderColor} h-full flex flex-col items-center justify-between`}
                >
                  <div>
                    <div
                      className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon
                        className={`w-10 h-10 ${feature.iconColor}`}
                      />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-black text-base font-semibold text-center">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Platform Integrations Section */}
          <div className="mt-24 max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center text-black mb-12">
              Boost your Learning with socializing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* LinkedIn Learning */}
              <a
                href="https://www.linkedin.com/learning/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center"
              >
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M100.28 448H7.4V149.9h92.88zm-46.44-340a53.79 
        53.79 0 1153.79-53.79 53.79 53.79 0 01-53.79 53.79zM447.9 
        448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.31 
        0-55.72 37.7-55.72 76.7V448h-92.7V149.9h89v40.7h1.3c12.4-23.5 
        42.6-48.3 87.7-48.3 93.8 0 111.1 61.8 111.1 142.3V448z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-black mb-2">
                  LinkedIn Learning
                </h3>
                <p className="text-black text-center font-semibold">
                  Explore professional courses, learning paths, and skill
                  certifications from experts.
                </p>
              </a>

              {/* GitHub Resources */}
              <a
                href="https://github.com/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-3xl shadow-xl border-4 border-gray-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center"
              >
                <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 
          3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
          0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
          -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 
          1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
          -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08
          -.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 
          7.65 0 012-.27c.68 0 1.36.09 2 
          .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 
          1.92.08 2.12.51.56.82 1.27.82 
          2.15 0 3.07-1.87 3.75-3.65 
          3.95.29.25.54.73.54 1.48 
          0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 
          8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-black mb-2">
                  GitHub Resources
                </h3>
                <p className="text-black text-center font-semibold">
                  Access open-source projects, learning repos, and curated
                  developer resources.
                </p>
              </a>

              {/* ChatGPT Assistance */}
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-3xl shadow-xl border-4 border-green-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center"
              >
                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-black mb-2">
                  ChatGPT Assistance
                </h3>
                <p className="text-black text-center font-semibold">
                  Get instant help, explanations, and personalized guidance
                  using AI-powered chat.
                </p>
              </a>
            </div>
          </div>

          {/* Platform Integrations Section */}
          <div className="mt-24 max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center text-black mb-12">
              One gateway for every question
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* Udemy */}
              <a
                href="https://www.udemy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl shadow-xl border-4 border-purple-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center h-52 justify-center"
              >
                <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l7 4v6l-7 4-7-4V6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-black">Udemy</h3>
                <p className="text-black text-center text-sm font-semibold">
                  Learn from 100,000+ courses across all tech skills.
                </p>
              </a>

              {/* Coursera */}
              <a
                href="https://www.coursera.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl shadow-xl border-4 border-blue-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center h-52 justify-center"
              >
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h18v18H3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-black">Coursera</h3>
                <p className="text-black text-center text-sm font-semibold">
                  Professional certificates & courses from top universities.
                </p>
              </a>

              {/* Google Classroom */}
              <a
                href="https://classroom.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl shadow-xl border-4 border-green-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center h-52 justify-center"
              >
                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v12H4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-black">
                  Google Classroom
                </h3>
                <p className="text-black text-center text-sm font-semibold">
                  Manage classes, assignments, and study materials.
                </p>
              </a>

              {/* GeeksForGeeks */}
              <a
                href="https://www.geeksforgeeks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl shadow-xl border-4 border-grey-300 
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
               flex flex-col items-center h-52 justify-center"
              >
                <div className="bg-grey-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-black-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
             10-4.48 10-10S17.52 2 12 2zm-1.1 14.59c-.33.28-.79.41-1.22.28-.33-.1-.6-.36-.71-.69-.11-.31-.05-.65.1-.93.34-.7 1.03-1.16 1.84-1.16h1.4c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 
             0-1-.45-1-1s.45-1 1-1h.58c1.61 0 2.92 1.31 2.92 
             2.92 0 1.61-1.31 2.92-2.92 2.92h-.3c-.28 0-.54.22-.67.44-.13.22-.23.5-.32.75zm5.2-6.09c.55 
             0 1 .45 1 1s-.45 1-1 1h-1.4c-.55 0-1 .45-1 
             1s.45 1 1 1h2c.55 0 1 .45 1 1s-.45 1-1 
             1h-.58c-1.61 0-2.92-1.31-2.92-2.92 0-1.61 
             1.31-2.92 2.92-2.92h.3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-black">GeeksForGeeks</h3>
                <p className="text-black text-center text-sm font-semibold">
                  In-depth articles, coding topics, interview prep, and
                  structured CS learning.
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <FloatingChatButton />
    </div>
  );
}
