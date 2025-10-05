'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-6">SkillzUp</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Search for any skill or topic"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Fetching resources...</p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {results.overview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Learning Roadmap</h2>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {results.overview.content}
                </div>
              </div>
            )}

            {results.resources?.videos && results.resources.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.resources.videos.map((video: any) => (
                    <div key={video.id} className="border rounded-lg overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h3 className="font-semibold text-sm">{video.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{video.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.resources?.articles && results.resources.articles.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.resources.articles.map((article: any) => (
                    <div key={article.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{article.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.resources?.news && results.resources.news.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">News</h2>
                <div className="space-y-4">
                  {results.resources.news.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 border rounded-lg p-4">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}