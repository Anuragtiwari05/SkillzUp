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
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-blue-700" />
            </button>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-blue-600 p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-900">SkillzUp</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SEARCH SECTION */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
          Generate Your Learning Roadmap
        </h1>

        <p className="text-lg text-blue-700 mb-10 font-medium">
          Enter any skill or topic and get a beautifully structured roadmap.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-blue-300 px-6 py-4 w-full transition mx-auto"
        >
          <input
            type="text"
            placeholder="Enter a topic... (e.g., React, AI, Web Dev)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 outline-none text-blue-900 placeholder-blue-400 text-lg font-semibold"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition text-lg font-bold flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Generate
          </button>
        </form>
      </div>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-blue-700">
              Generating your personalized roadmap...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !roadmap && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Start your learning journey!
            </h2>
            <p className="text-lg text-blue-700">
              Use the search bar above to generate a curated roadmap.
            </p>
          </div>
        )}

        {/* Roadmap */}
        {!loading && roadmapArray.length > 0 && (
          <div className="mt-10 space-y-10">
            <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12">
              🛣 Roadmap for "{roadmap.topic || query}"
            </h2>

            {roadmapArray.map((stage: any, idx: number) => (
              <div
                key={idx}
                className="relative bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-300 hover:shadow-xl transition"
              >
                <div className="absolute -left-4 top-6 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {idx + 1}
                </div>

                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-blue-800">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  {stage.stage}
                </h3>

                <p className="text-blue-900 mb-4 leading-relaxed text-lg">
                  {stage.description}
                </p>

                {stage.resources?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">
                      📚 Recommended Resources:
                    </h4>

                    <ul className="list-disc ml-6 space-y-1">
                      {stage.resources.map((res: any, i: number) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-medium"
                          >
                            {res.title} ({res.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.estimated_time && (
                  <p className="text-sm text-blue-700 mt-2">
                    ⏱ Estimated Time:{" "}
                    <span className="font-semibold">{stage.estimated_time}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-blue-900 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl font-black text-white">
            © 2025 SkillzUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
