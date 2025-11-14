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
      if (data.items && Array.isArray(data.items)) {
        setArticles(data.items);
      } else {
        setError("No news found for this search.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur border-b border-purple-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

          {/* Back Button + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-purple-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-purple-800" />
            </button>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-purple-600 p-2 rounded-lg hover:scale-105 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-900">
                SkillzUp
              </span>
            </div>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 mb-6">
          Explore the Latest News
        </h1>

        <p className="text-lg text-purple-700 font-medium mb-10">
          Search the newest headlines, breaking stories, and global updates.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white shadow-lg hover:shadow-xl rounded-2xl border-2 border-purple-300 px-6 py-4 w-full transition mx-auto"
        >
          <Newspaper className="w-7 h-7 text-purple-600" />

          <input
            type="text"
            placeholder="Search for latest news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 outline-none text-purple-900 placeholder-purple-400 text-lg font-semibold"
          />

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition text-lg font-bold flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> Search
          </button>
        </form>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-purple-800">
              Fetching latest news...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <Newspaper className="w-16 h-16 text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold text-purple-900 mb-2">
              Search the Latest News
            </h2>
            <p className="text-lg text-purple-700">
              Enter a topic above to discover top global headlines.
            </p>
          </div>
        )}

        {/* NEWS GRID */}
        {!loading && articles.length > 0 && (
          <div>
            <h2 className="text-4xl font-extrabold text-purple-900 mb-10 text-center">
              📰 Top News for “{query}”
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((art, idx) => (
                <a
                  key={idx}
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border border-purple-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition"
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-56 bg-purple-100">
                    {art.urlToImage ? (
                      <img
                        src={art.urlToImage}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-400">
                        <Newspaper className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col justify-between min-h-[200px]">
                    <h3 className="font-bold text-purple-900 text-lg line-clamp-2 mb-2">
                      {art.title}
                    </h3>

                    <p className="text-purple-700 text-sm font-medium line-clamp-3 mb-3">
                      {art.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-purple-800">
                        🏷️ {art.source?.name}
                      </p>
                      <ExternalLink className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-purple-900 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl font-black text-white">
            © 2025 SkillzUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
