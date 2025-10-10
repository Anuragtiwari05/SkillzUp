// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaVideo, FaFileAlt, FaNewspaper } from 'react-icons/fa';

interface ResourceItem {
  id: string;
  type: string;
  title: string;
  description: string;
  link: string;
  thumbnail?: string;
  author?: string;
  source?: string;
  publishedAt?: string;
}

interface ApiResponse {
  success: boolean;
  topic: string;
  overview: {
    content: string;
    generatedBy: string;
  };
  resources: {
    videos: ResourceItem[];
    articles: ResourceItem[];
    news: ResourceItem[];
  };
  stats: {
    totalVideos: number;
    totalArticles: number;
    totalNews: number;
    totalResources: number;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });
        const result: ApiResponse = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topic]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-700 font-bold text-xl">Loading results for "{topic}"...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">Failed to load results.</div>;

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight">SkillzUp</h1>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:underline transition">Home</a>
          <a href="#" className="hover:underline transition">About</a>
          <a href="#" className="hover:underline transition">Contact</a>
        </div>
      </nav>

      <main className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
          Results for "{topic}"
        </h2>

        {/* Overview / Roadmap */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8 animate-fadeIn">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Learning Overview</h3>
          <p className="text-black whitespace-pre-line">{data.overview.content || 'No roadmap available.'}</p>
        </section>

        {/* Resources */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Videos */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform duration-300">
            <h4 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><FaVideo /> Videos ({data.stats.totalVideos})</h4>
            {data.resources.videos.length === 0 ? <p className="text-black">No videos found.</p> : (
              <ul className="space-y-4">
                {data.resources.videos.map(video => (
                  <li key={video.id} className="border border-blue-200 p-3 rounded hover:shadow-md transition">
                    {video.thumbnail && <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded mb-2" />}
                    <a href={video.link} target="_blank" className="font-semibold text-blue-800 hover:underline">{video.title}</a>
                    <p className="text-black text-sm mt-1">{video.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Articles */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform duration-300">
            <h4 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><FaFileAlt /> Articles ({data.stats.totalArticles})</h4>
            {data.resources.articles.length === 0 ? <p className="text-black">No articles found.</p> : (
              <ul className="space-y-4">
                {data.resources.articles.map(article => (
                  <li key={article.id} className="border border-blue-200 p-3 rounded hover:shadow-md transition">
                    <a href={article.link} target="_blank" className="font-semibold text-blue-800 hover:underline">{article.title}</a>
                    <p className="text-black text-sm mt-1">{article.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* News */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform duration-300">
            <h4 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><FaNewspaper /> News ({data.stats.totalNews})</h4>
            {data.resources.news.length === 0 ? <p className="text-black">No news found.</p> : (
              <ul className="space-y-4">
                {data.resources.news.map(news => (
                  <li key={news.id || news.link} className="border border-blue-200 p-3 rounded hover:shadow-md transition">
                    <a href={news.link} target="_blank" className="font-semibold text-blue-800 hover:underline">{news.title}</a>
                    <p className="text-black text-sm mt-1">{news.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-blue-700 border-t border-blue-200">
        &copy; 2025 SkillzUp. All rights reserved.
      </footer>
    </div>
  );
}
