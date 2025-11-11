'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, ArrowLeft } from 'lucide-react';

export default function RoadmapPage() {
  const [query, setQuery] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      setRoadmap(data);
    } catch (err: any) {
      console.error("❌ Error fetching roadmap:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <div className="bg-blue-600 p-2 rounded-lg hover:scale-110 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">SkillzUp</span>
            </div>
          </div>

          {/* Search Bar */}
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
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-black">Generating roadmap...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !roadmap && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-3xl font-bold text-black mb-2">
              Generate a Skill Learning Roadmap
            </h2>
            <p className="text-lg text-gray-600">
              Enter a skill or topic above to receive a structured roadmap.
            </p>
          </div>
        )}

        {!loading && roadmap && (
          <div>
            <h2 className="text-4xl font-black text-black mb-8 text-center">
              🛣 Roadmap for "{roadmap.topic || query}"
            </h2>
            <div className="space-y-6">
              {roadmap.roadmap?.map((stage: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-2">{stage.stage}</h3>
                  <p className="text-gray-700 mb-3">{stage.description}</p>
                  {stage.resources?.length > 0 && (
                    <ul className="list-disc ml-5 mb-3">
                      {stage.resources.map((res: any, i: number) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 font-semibold hover:underline"
                          >
                            {res.title} ({res.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {stage.estimated_time && (
                    <p className="text-sm font-semibold text-gray-600">
                      ⏱ Estimated Time: {stage.estimated_time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-blue-900 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl font-black text-white">
            &copy; 2025 SkillzUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
