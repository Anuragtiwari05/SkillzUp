"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpen, Video, FileText, Newspaper, ArrowLeft, ExternalLink, User, Play, TrendingUp } from 'lucide-react';
import { ApiResponse, ResourceItem } from '@/models/apiTypes';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || '';
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!topic) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch('http://localhost:2005/webhook/skillzup-search', { // n8n webhook
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const result: ApiResponse = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-3xl font-bold text-black">Searching for "{topic}"</h2>
          <p className="text-black text-lg">Gathering the best learning resources...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-7xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-black">Something went wrong</h2>
          <p className="text-black text-lg">Please try again</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-blue-50 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6 text-black" />
              </button>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold text-black">SkillzUp</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-black hover:text-blue-600 font-semibold">Home</a>
              <a href="#" className="text-black hover:text-blue-600 font-semibold">About</a>
              <a href="#" className="text-black hover:text-blue-600 font-semibold">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-blue-500">
          <div className="mb-6">
            <span className="bg-blue-600 text-black px-5 py-2 rounded-full text-sm font-bold inline-block mb-4">
              SEARCH RESULTS
            </span>
            <h1 className="text-6xl font-extrabold text-black mb-4">{topic}</h1>
            <p className="text-2xl font-bold text-black">{data.stats.totalResources} Resources Found</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-2xl border-2 border-red-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black text-black">{data.stats.totalVideos}</div>
                  <div className="text-lg font-bold text-black mt-2">Videos</div>
                </div>
                <Video className="w-12 h-12 text-black" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl border-2 border-green-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black text-black">{data.stats.totalArticles}</div>
                  <div className="text-lg font-bold text-black mt-2">Articles</div>
                </div>
                <FileText className="w-12 h-12 text-black" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl border-2 border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black text-black">{data.stats.totalNews}</div>
                  <div className="text-lg font-bold text-black mt-2">News</div>
                </div>
                <Newspaper className="w-12 h-12 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* ROADMAP SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-blue-500">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-5xl font-black text-black">Learning Roadmap</h2>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-300">
            <p className="text-xl leading-relaxed font-semibold text-black whitespace-pre-line">
              {data.overview.content || 'No roadmap available.'}
            </p>
            <div className="mt-6 pt-6 border-t-2 border-blue-300">
              <p className="text-base font-bold text-black">✨ {data.overview.generatedBy}</p>
            </div>
          </div>
        </div>

        {/* Videos, Articles, News Sections */}
        {['videos','articles','news'].map((section) => (
          <Section key={section} type={section} items={data.resources[section as keyof typeof data.resources] as ResourceItem[]} />
        ))}

      </main>

      {/* Footer */}
      <footer className="bg-blue-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-black text-white">&copy; 2025 SkillzUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Reusable Section component for Videos / Articles / News
function Section({ type, items }: { type: string; items: ResourceItem[] }) {
  const icons = { videos: Video, articles: FileText, news: Newspaper };
  const colors = { videos: 'red', articles: 'green', news: 'purple' };
  const Icon = icons[type as keyof typeof icons];

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-${colors[type as keyof typeof colors]}-500`}>
      <div className="flex items-center space-x-4 mb-8">
        <div className={`bg-${colors[type as keyof typeof colors]}-500 p-4 rounded-2xl`}>
          <Icon className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-5xl font-black text-black">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-100 rounded-2xl">
          <p className="text-2xl font-bold text-black">No {type} found</p>
        </div>
      ) : (
        <div className={`grid ${type==='videos'?'grid-cols-3':'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {items.map((item) => (
            <a
              key={item.id || item.link}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-current transition-all duration-300 hover:shadow-2xl hover:scale-105 transform p-4"
            >
              {type==='videos' && item.thumbnail && (
                <div className="relative h-48 bg-black mb-4">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-red-500 rounded-full p-4">
                      <Play className="w-8 h-8 text-black fill-black" />
                    </div>
                  </div>
                </div>
              )}
              <h3 className="font-black text-black text-lg mb-2 line-clamp-2">{item.title}</h3>
              {item.description && <p className="text-base text-black font-semibold line-clamp-3 mb-2">{item.description}</p>}
              {item.author && <div className="flex items-center text-black font-bold text-sm mb-1"><User className="w-4 h-4 mr-2 text-black" />{item.author}</div>}
              {item.source && <span className={`text-sm font-bold text-black bg-${colors[type as keyof typeof colors]}-100 px-3 py-1 rounded-full`}>{item.source}</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
