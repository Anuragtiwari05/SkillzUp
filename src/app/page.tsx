"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import FloatingChatButton from "../component/FloatingChatButton";
import Subscription from "../component/newSubscription";
import {
  Map,
  FileText,
  TrendingUp,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Youtube } from "lucide-react";

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
      icon: Youtube,
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-600 px-4 sm:px-5 py-2 rounded-full font-bold mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base">
                Your Learning Journey Starts Here
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight">
              Master Any Skill with
              <span className="text-blue-600"> Personalized Roadmaps</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
              Get structured learning paths, curated YouTube channels, expert
              articles, and trending news — all tailored to accelerate your
              growth.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 sm:mt-16">
            {features.map((feature, idx) => (
              <Link href={feature.link || "#"} key={idx} className="h-full">
                <div
                  className={`bg-white p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border-4 ${feature.borderColor} h-full flex flex-col items-center justify-between`}
                >
                  <div>
                    <div
                      className={`${feature.color} w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon
                        className={`w-8 sm:w-10 h-8 sm:h-10 ${feature.iconColor}`}
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-black mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-black font-semibold text-center">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Platform Integrations Section */}
          <div className="mt-16 sm:mt-24 max-w-5xl mx-auto px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
              Boost your Learning with socializing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* LinkedIn Learning */}
              <a
                href="https://www.linkedin.com/learning/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-blue-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-blue-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-blue-600"
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
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">
                  LinkedIn Learning
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Explore professional courses, learning paths, and skill
                  certifications from experts.
                </p>
              </a>

              {/* GitHub Resources */}
              <a
                href="https://github.com/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-gray-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-gray-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-gray-700"
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
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">
                  GitHub Resources
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Access open-source projects, learning repos, and curated
                  developer resources.
                </p>
              </a>

              {/* ChatGPT Assistance */}
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-green-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-green-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">
                  ChatGPT Assistance
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Get instant help, explanations, and personalized guidance
                  using AI-powered chat.
                </p>
              </a>
            </div>
          </div>

          {/* One Gateway Section */}
          <div className="mt-16 sm:mt-24 max-w-6xl mx-auto px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
              One gateway for every question
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Udemy */}
              <a
                href="https://www.udemy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-purple-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l7 4v6l-7 4-7-4V6z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-1">
                  Udemy
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Learn from 100,000+ courses across all tech skills.
                </p>
              </a>

              {/* Coursera */}
              <a
                href="https://www.coursera.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-blue-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-blue-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h18v18H3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-1">
                  Coursera
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Professional certificates & courses from top universities.
                </p>
              </a>

              {/* Google Classroom */}
              <a
                href="https://classroom.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-green-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-green-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-8 sm:w-10 h-8 sm:h-10 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v12H4z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-1">
                  Google Classroom
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  Manage classes, assignments, and study materials.
                </p>
              </a>

              {/* GeeksForGeeks */}
              <a
                href="https://www.geeksforgeeks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-gray-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
              >
                <div className="bg-gray-100 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-1">
                  GeeksForGeeks
                </h3>
                <p className="text-sm sm:text-base text-black text-center font-semibold">
                  In-depth articles, coding topics, interview prep, and structured CS learning.
                </p>
              </a>
            </div>
          </div>
          <Subscription />
        </section>
      </main>

      <Footer />

      <FloatingChatButton />
    </div>
  );
}
