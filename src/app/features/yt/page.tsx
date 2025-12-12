"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Youtube, PlayCircle, ArrowLeft } from "lucide-react";

export default function YTFeaturePage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setVideos([]);

    try {
      const res = await fetch(`/api/features/yt?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      if (data.items && Array.isArray(data.items)) {
        setVideos(data.items);
      } else {
        setError("No videos found.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-red-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-1 sm:p-2 rounded-full hover:bg-red-100 transition"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6 text-red-700" />
            </button>

            <div
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-red-600 p-1 sm:p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-red-900">SkillzUp</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-900 mb-4 sm:mb-6">
          Search YouTube Learning Videos
        </h1>
        <p className="text-base sm:text-lg text-red-700 mb-8 sm:mb-10 font-medium">
          Enter any topic and discover top tutorials instantly.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-red-300 px-4 sm:px-6 py-3 sm:py-4 w-full mx-auto gap-2 sm:gap-3"
        >
          <Youtube className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
          <input
            type="text"
            placeholder="Search YouTube tutorials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 sm:py-2.5 outline-none text-red-900 placeholder-red-400 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-red-700 transition text-sm sm:text-lg font-bold w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5" /> Search
          </button>
        </form>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl sm:text-2xl font-bold text-red-700">Fetching top YouTube videos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <Youtube className="w-12 sm:w-16 h-12 sm:h-16 text-red-600 mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-red-900 mb-2">Search for YouTube Tutorials</h2>
            <p className="text-base sm:text-lg text-red-700">Type a topic above to begin.</p>
          </div>
        )}

        {/* Results */}
        {!loading && videos.length > 0 && (
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-red-900 mb-8 sm:mb-12">
              🎥 Top YouTube Videos for "{query}"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {videos.map((vid, idx) => (
                <a
                  key={idx}
                  href={`https://www.youtube.com/watch?v=${vid.id?.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border border-red-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <div className="relative w-full h-48 sm:h-56 bg-gray-200">
                    <img
                      src={vid.snippet?.thumbnails?.high?.url}
                      alt={vid.snippet?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-12 sm:w-14 h-12 sm:h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]">
                    <h3 className="font-bold text-red-900 text-base sm:text-lg line-clamp-2 mb-2">{vid.snippet?.title}</h3>
                    <p className="text-red-700 text-sm sm:text-base font-medium line-clamp-2 mb-2">{vid.snippet?.description}</p>
                    <p className="text-sm sm:text-base font-semibold text-red-800 truncate">📺 {vid.snippet?.channelTitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-red-900 py-6 sm:py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg font-black text-white">© 2025 SkillzUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
