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
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-red-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-red-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-red-700" />
            </button>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-red-600 p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-900">SkillzUp</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SEARCH */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-900 mb-6">
          Search YouTube Learning Videos
        </h1>

        <p className="text-lg text-red-700 mb-10 font-medium">
          Enter any topic and discover top tutorials instantly.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-red-300 px-6 py-4 w-full transition mx-auto"
        >
          <Youtube className="w-7 h-7 text-red-600" />

          <input
            type="text"
            placeholder="Search YouTube tutorials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 outline-none text-red-900 placeholder-red-400 text-lg font-semibold"
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition text-lg font-bold flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-red-700">
              Fetching top YouTube videos...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <Youtube className="w-16 h-16 text-red-600 mb-4" />
            <h2 className="text-3xl font-bold text-red-900 mb-2">
              Search for YouTube Tutorials
            </h2>
            <p className="text-lg text-red-700">
              Type a topic above to begin.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {!loading && videos.length > 0 && (
          <div>
            <h2 className="text-4xl font-extrabold text-center text-red-900 mb-12">
              🎥 Top YouTube Videos for "{query}"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {videos.map((vid, idx) => (
                <a
                  key={idx}
                  href={`https://www.youtube.com/watch?v=${vid.id?.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border border-red-200 rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <div className="relative w-full h-56 bg-gray-200">
                    <img
                      src={vid.snippet?.thumbnails?.high?.url}
                      alt={vid.snippet?.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between min-h-[180px]">
                    <h3 className="font-bold text-red-900 text-lg line-clamp-2 mb-2">
                      {vid.snippet?.title}
                    </h3>

                    <p className="text-red-700 text-sm font-medium line-clamp-2 mb-3">
                      {vid.snippet?.description}
                    </p>

                    <p className="text-sm font-semibold text-red-800">
                      📺 {vid.snippet?.channelTitle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-red-900 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl font-black text-white">
            © 2025 SkillzUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
