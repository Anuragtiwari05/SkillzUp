'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Youtube, PlayCircle, ArrowLeft } from 'lucide-react';

export default function YTFeaturePage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    console.log("🚀 Starting search for:", query);
    setLoading(true);
    setError('');
    setVideos([]);

    try {
      const res = await fetch(`/api/features/yt?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("🌍 Fetch called:", res);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch videos');
      }

      const data = await res.json();
      console.log("🎬 Raw data received from API:", data);

      if (data.items && Array.isArray(data.items)) {
        console.log(`📦 Received ${data.items.length} videos.`);
        setVideos(data.items);
      } else {
        console.warn("⚠️ No valid video array found in API response.");
        setError('No videos found for this search.');
      }
    } catch (err: any) {
      console.error("❌ Error during fetch:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      console.log("🟢 Search complete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          
          {/* Logo + Back button */}
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
            <Youtube className="w-7 h-7 text-red-600" />
            <input
              type="text"
              placeholder="Search YouTube videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 outline-none text-black font-semibold placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-5 py-1.5 rounded-full hover:bg-red-700 transition-all duration-300 font-bold flex items-center gap-2"
            >
              <Search className="w-5 h-5" /> Search
            </button>
          </form>
        </div>
      </nav>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-black">Fetching top YouTube videos...</p>
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
            <h2 className="text-3xl font-bold text-black mb-2">
              Search YouTube Learning Videos
            </h2>
            <p className="text-lg text-gray-600">
              Enter a topic above to discover top tutorials and guides.
            </p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div>
            <h2 className="text-4xl font-black text-black mb-10 text-center">
              🎥 Top YouTube Videos for “{query}”
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {videos.map((vid, idx) => (
                <a
                  key={idx}
                  href={`https://www.youtube.com/watch?v=${vid.id?.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative w-full h-56 bg-gray-200">
                    <img
                      src={vid.snippet?.thumbnails?.high?.url}
                      alt={vid.snippet?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between min-h-[180px]">
                    <h3 className="font-bold text-black text-lg line-clamp-2 mb-2">
                      {vid.snippet?.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-3">
                      {vid.snippet?.description}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      📺 {vid.snippet?.channelTitle}
                    </p>
                  </div>
                </a>
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
