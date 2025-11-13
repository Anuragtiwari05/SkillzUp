'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Newspaper, ArrowLeft, ExternalLink } from 'lucide-react';

export default function ArticlesFeaturePage() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    console.log("📰 Searching for:", query);
    setLoading(true);
    setError('');
    setArticles([]);

    try {
      const res = await fetch(`/api/features/article?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch articles');

      const data = await res.json();
      console.log("✅ Articles data:", data);

      if (data.items && Array.isArray(data.items)) {
        setArticles(data.items);
      } else {
        setError('No articles found for this search.');
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
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

          <form
            onSubmit={handleSearch}
            className="flex items-center space-x-3 bg-white rounded-full border-2 border-blue-400 px-4 py-2 shadow-sm hover:shadow-lg transition-all duration-300 w-full max-w-xl mx-auto"
          >
            <Newspaper className="w-7 h-7 text-blue-600" />
            <input
              type="text"
              placeholder="Search tech or learning articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 outline-none text-black font-semibold placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-1.5 rounded-full hover:bg-blue-700 transition-all duration-300 font-bold flex items-center gap-2"
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
            <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-black">Fetching latest articles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <Newspaper className="w-16 h-16 text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-black mb-2">
              Explore the Latest Articles
            </h2>
            <p className="text-lg text-gray-600">
              Search for tech, coding, or AI-related news and blogs.
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div>
            <h2 className="text-4xl font-black text-black mb-10 text-center">
              📰 Top Articles for “{query}”
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((art, idx) => (
                <a
                  key={idx}
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative w-full h-56 bg-gray-200">
                    {art.image ? (
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Newspaper className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col justify-between min-h-[200px]">
                    <h3 className="font-bold text-black text-lg line-clamp-2 mb-2">
                      {art.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium line-clamp-3 mb-3">
                      {art.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-800">
                        🏷️ {art.source?.name}
                      </p>
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
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
