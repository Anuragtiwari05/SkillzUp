'use client';
export const dynamic = "force-dynamic";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpen, Video, FileText, Newspaper, Loader2, ArrowLeft, ExternalLink, Clock, User, Play, TrendingUp } from 'lucide-react';
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
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        
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
            <h1 className="text-6xl font-extrabold text-black mb-4">
              {topic}
            </h1>
            <p className="text-2xl font-bold text-black">
              {data.stats.totalResources} Resources Found
            </p>
          </div>
          
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

        {/* YOUTUBE  SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-red-500">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-red-500 p-4 rounded-2xl">
              <Video className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-5xl font-black text-black">YouTube Videos</h2>
          </div>
          
          {data.resources.videos.length === 0 ? (
            <div className="text-center py-16 bg-gray-100 rounded-2xl">
              <p className="text-2xl font-bold text-black">No videos found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {data.resources.videos.map((video) => (
                <a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-2xl overflow-hidden border-4 border-gray-300 hover:border-red-500 transition-all duration-300 hover:shadow-2xl"
                >
                  {video.thumbnail && (
                    <div className="relative h-48 bg-black">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-red-500 rounded-full p-4">
                          <Play className="w-8 h-8 text-black fill-black" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-black text-black text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-base text-black font-semibold line-clamp-2 mb-3">
                      {video.description}
                    </p>
                    {video.author && (
                      <div className="flex items-center text-black font-bold text-sm">
                        <User className="w-4 h-4 mr-2 text-black" />
                        {video.author}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

       {/* ARTICLES SECTION */}
<div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-green-500">
  <div className="flex items-center space-x-4 mb-8">
    <div className="bg-green-500 p-4 rounded-2xl">
      <FileText className="w-10 h-10 text-black" />
    </div>
    <h2 className="text-5xl font-black text-black">Articles & Guides</h2>
  </div>

  {data.resources.articles.length === 0 ? (
    <div className="text-center py-16 bg-gray-100 rounded-2xl">
      <p className="text-2xl font-bold text-black">No articles found</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.resources.articles.map((article) => (
        <a
          key={article.id}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gray-50 rounded-2xl p-6 border-2 border-gray-300 hover:border-green-500 
                     transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="font-extrabold text-black text-2xl mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                {article.title}
              </h3>
              <p className="text-base text-black font-semibold line-clamp-3 mb-4">
                {article.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              {article.source && (
                <span className="text-sm font-bold text-black bg-green-100 px-3 py-1 rounded-full">
                  {article.source}
                </span>
              )}
              <ExternalLink className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>
      ))}
    </div>
  )}
</div>

{/* NEWS SECTION */}
<div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-4 border-purple-500">
  <div className="flex items-center space-x-4 mb-8">
    <div className="bg-purple-500 p-4 rounded-2xl">
      <Newspaper className="w-10 h-10 text-black" />
    </div>
    <h2 className="text-5xl font-black text-black">Latest News</h2>
  </div>

  {data.resources.news.length === 0 ? (
    <div className="text-center py-16 bg-gray-100 rounded-2xl">
      <p className="text-2xl font-bold text-black">No news found</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.resources.news.map((news) => (
        <a
          key={news.id || news.link}
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gray-50 rounded-2xl p-6 border-2 border-gray-300 hover:border-purple-500 
                     transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="font-extrabold text-black text-2xl mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                {news.title}
              </h3>
              <p className="text-base text-black font-semibold line-clamp-3 mb-4">
                {news.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              {news.publishedAt && (
                <span className="text-sm font-bold text-black bg-purple-100 px-3 py-1 rounded-full">
                  {new Date(news.publishedAt).toLocaleDateString()}
                </span>
              )}
              <ExternalLink className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>
      ))}
    </div>
  )}
</div>


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