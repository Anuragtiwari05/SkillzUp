'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RoadmapPage() {
  const [query, setQuery] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => setIsClient(true), []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const res = await fetch(`/api/features/roadmap?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch roadmap');
      }

      const data = await res.json();
      console.log("✅ Roadmap received:", data);
      setRoadmap(data);
    } catch (err) {
      console.error("❌ Error fetching roadmap:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  const roadmapArray = Array.isArray(roadmap?.roadmap) ? roadmap.roadmap : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="bg-blue-600 p-2 rounded-lg hover:scale-110 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">SkillzUp</span>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center space-x-3 bg-white rounded-full border-2 border-red-400 px-4 py-2 shadow-sm hover:shadow-lg transition-all duration-300 w-full max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="Enter a topic to generate roadmap..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 outline-none text-black font-semibold placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-5 py-1.5 rounded-full hover:bg-red-700 transition-all duration-300 font-bold flex items-center gap-2"
            >
              <Search className="w-5 h-5" /> Generate
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-black">Generating your personalized roadmap...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !roadmap && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-3xl font-bold text-black mb-2">Generate a Skill Learning Roadmap</h2>
            <p className="text-lg text-gray-600">Enter a skill or topic above to receive a structured, beautiful roadmap.</p>
          </div>
        )}

        {!loading && roadmapArray.length > 0 && (
          <div className="mt-6 space-y-10">
            <h2 className="text-4xl font-extrabold text-center text-black mb-10">
              🛣 Roadmap for "{roadmap.topic || query}"
            </h2>

            {roadmapArray.map((stage: any, idx: number) => (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg"
              >
                <div className="absolute -left-3 top-5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-red-700">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  {stage.stage}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed text-lg">{stage.description}</p>

                {stage.resources?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">📚 Recommended Resources:</h4>
                    <ul className="list-disc ml-6 space-y-1">
                      {stage.resources.map((res: any, i: number) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {res.title} ({res.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.estimated_time && (
                  <p className="text-sm text-gray-500 mt-2">
                    ⏱ Estimated Time: <span className="font-semibold">{stage.estimated_time}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-blue-900 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl font-black text-white">&copy; 2025 SkillzUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
