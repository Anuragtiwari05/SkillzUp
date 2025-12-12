"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Newspaper, ArrowLeft, ExternalLink } from "lucide-react";

export default function NewsFeaturePage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setArticles([]);

    try {
      const res = await fetch(`/api/features/news?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch news");

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) setArticles(data.items);
      else setError("No news found for this search.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-purple-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-1 sm:p-2 rounded-full hover:bg-purple-100 transition"
            >
              <ArrowLeft className="w-4 sm:w-6 h-4 sm:h-6 text-purple-800" />
            </button>
            <div
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-purple-600 p-1 sm:p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-purple-900">SkillzUp</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero + Search */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-900 mb-4 sm:mb-6">
          Explore the Latest News
        </h1>
        <p className="text-base sm:text-lg text-purple-700 font-medium mb-8 sm:mb-10">
          Search the newest headlines, breaking stories, and global updates.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-purple-300 px-4 sm:px-6 py-3 w-full transition mx-auto gap-2 sm:gap-3"
        >
          <Newspaper className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
          <input
            type="text"
            placeholder="Search for latest news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 outline-none text-purple-900 placeholder-purple-400 text-sm sm:text-base font-semibold rounded-lg sm:rounded-none w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-purple-700 transition text-sm sm:text-lg font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5" /> Search
          </button>
        </form>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl sm:text-2xl font-bold text-purple-800">Fetching latest news...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <Newspaper className="w-12 sm:w-16 h-12 sm:h-16 text-purple-600 mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">Search the Latest News</h2>
            <p className="text-base sm:text-lg text-purple-700">Enter a topic above to discover top global headlines.</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-900 mb-10 text-center">
              📰 Top News for “{query}”
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {articles.map((art, idx) => (
                <a
                  key={idx}
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border border-purple-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition"
                >
                  <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-purple-100">
                    {art.urlToImage ? (
                      <img src={art.urlToImage} alt={art.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-400">
                        <Newspaper className="w-8 sm:w-10 h-8 sm:h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-5 flex flex-col justify-between min-h-[180px]">
                    <h3 className="font-bold text-purple-900 text-sm sm:text-base lg:text-lg line-clamp-2 mb-2">{art.title}</h3>
                    <p className="text-purple-700 text-xs sm:text-sm lg:text-base font-medium line-clamp-3 mb-3">{art.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm font-semibold text-purple-800 truncate">🏷️ {art.source?.name}</p>
                      <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-purple-900 py-6 sm:py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg font-black text-white">© 2025 SkillzUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
