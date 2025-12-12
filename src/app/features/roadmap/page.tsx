"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RoadmapPage() {
  const [query, setQuery] = useState("");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => setIsClient(true), []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setRoadmap(null);

    try {
      const res = await fetch(`/api/features/roadmap?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error("❌ Error fetching roadmap:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  const roadmapArray = Array.isArray(roadmap?.roadmap) ? roadmap.roadmap : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-1 sm:p-2 rounded-full hover:bg-blue-100 transition"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6 text-blue-700" />
            </button>

            <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="bg-blue-600 p-1 sm:p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-blue-900">SkillzUp</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 sm:mb-6">
          Generate Your Learning Roadmap
        </h1>
        <p className="text-base sm:text-lg text-blue-700 mb-8 sm:mb-10 font-medium">
          Enter any skill or topic and get a beautifully structured roadmap.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-blue-300 px-4 sm:px-6 py-3 sm:py-4 w-full mx-auto gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Enter a topic... (e.g., React, AI, Web Dev)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 sm:py-2.5 outline-none text-blue-900 placeholder-blue-400 text-base sm:text-lg font-semibold rounded-lg sm:rounded-none w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-700 transition text-sm sm:text-lg font-bold w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5" /> Generate
          </button>
        </form>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">Generating your personalized roadmap...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !roadmap && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Start your learning journey!</h2>
            <p className="text-base sm:text-lg text-blue-700">
              Use the search bar above to generate a curated roadmap.
            </p>
          </div>
        )}

        {/* Roadmap */}
        {!loading && roadmapArray.length > 0 && (
          <div className="mt-10 space-y-8 sm:space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-8 sm:mb-12">
              🛣 Roadmap for "{roadmap.topic || query}"
            </h2>

            {roadmapArray.map((stage: any, idx: number) => (
              <div
                key={idx}
                className="relative bg-blue-50 p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-blue-300 hover:shadow-xl transition"
              >
                <div className="absolute -left-4 sm:-left-5 top-6 w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {idx + 1}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 flex items-center gap-2 text-blue-800">
                  <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  {stage.stage}
                </h3>

                <p className="text-blue-900 mb-3 sm:mb-4 leading-relaxed text-base sm:text-lg">
                  {stage.description}
                </p>

                {stage.resources?.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-1 sm:mb-2">
                      📚 Recommended Resources:
                    </h4>
                    <ul className="list-disc ml-5 sm:ml-6 space-y-1">
                      {stage.resources.map((res: any, i: number) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-medium text-sm sm:text-base"
                          >
                            {res.title} ({res.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.estimated_time && (
                  <p className="text-sm sm:text-base text-blue-700 mt-1 sm:mt-2">
                    ⏱ Estimated Time: <span className="font-semibold">{stage.estimated_time}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-blue-900 py-6 sm:py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg font-black text-white">© 2025 SkillzUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
