"use client";

import { useEffect, useState } from "react";
import { Search, Youtube, PlayCircle } from "lucide-react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import BackButton from "@/component/ui/BackButton";
import Loader from "@/component/ui/Loader";
import Reveal from "@/component/ui/Reveal";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import BookmarkButton from "@/component/ui/BookmarkButton";
import { recordView } from "@/lib/track";

export default function YTFeaturePage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/bookmarks", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedUrls(new Set(data.bookmarks.map((b: any) => b.sourceUrl)));
        }
      })
      .catch(() => {});
  }, []);

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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <BackButton />
        </div>

        {/* Hero Search */}
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <p className="eyebrow text-primary-600 mb-3">YouTube Channels</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-4 sm:mb-6">
            Search YouTube Learning Videos
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-10 font-medium">
            Enter any topic and discover top tutorials instantly.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center bg-surface shadow-md hover:shadow-lg rounded-2xl border-2 border-surface-border focus-within:border-primary-400 px-4 sm:px-6 py-3 sm:py-4 w-full mx-auto gap-2 sm:gap-3 transition"
          >
            <Youtube className="w-5 sm:w-6 h-5 sm:h-6 text-primary-600 hidden sm:block" />
            <input
              type="text"
              placeholder="Search YouTube tutorials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 sm:py-2.5 outline-none text-neutral-900 placeholder-neutral-400 text-base sm:text-lg font-medium rounded-lg w-full sm:w-auto"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="w-4 sm:w-5 h-4 sm:h-5" /> Search
            </Button>
          </form>
        </Reveal>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          {loading && <Loader size="lg" label="Fetching top YouTube videos..." />}

          {error && (
            <div className="text-center py-32">
              <p className="text-2xl font-bold text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Youtube className="w-12 sm:w-16 h-12 sm:h-16 text-primary-600 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900 mb-2">Search for YouTube Tutorials</h2>
              <p className="text-base sm:text-lg text-neutral-600">Type a topic above to begin.</p>
            </div>
          )}

          {/* Results */}
          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {videos.map((vid, idx) => {
                const videoUrl = `https://www.youtube.com/watch?v=${vid.id?.videoId}`;
                return (
                  <Reveal key={idx} delay={Math.min(idx * 0.05, 0.3)}>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      onClick={() => recordView("video", videoUrl, vid.snippet?.title || "")}
                    >
                      <Card className="group overflow-hidden">
                        <div className="relative w-full h-48 sm:h-56 bg-neutral-100">
                          <img
                            src={vid.snippet?.thumbnails?.high?.url}
                            alt={vid.snippet?.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircle className="w-12 sm:w-14 h-12 sm:h-14 text-white drop-shadow-lg" />
                          </div>
                          <BookmarkButton
                            className="absolute top-2 right-2"
                            itemType="video"
                            sourceUrl={videoUrl}
                            title={vid.snippet?.title || ""}
                            thumbnailUrl={vid.snippet?.thumbnails?.high?.url}
                            saved={savedUrls.has(videoUrl)}
                            onChange={(saved) =>
                              setSavedUrls((prev) => {
                                const next = new Set(prev);
                                saved ? next.add(videoUrl) : next.delete(videoUrl);
                                return next;
                              })
                            }
                          />
                        </div>

                        <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]">
                          <h3 className="font-bold text-neutral-900 text-base sm:text-lg line-clamp-2 mb-2">{vid.snippet?.title}</h3>
                          <p className="text-neutral-600 text-sm sm:text-base font-medium line-clamp-2 mb-2">{vid.snippet?.description}</p>
                          <p className="text-sm sm:text-base font-semibold text-primary-700 truncate">{vid.snippet?.channelTitle}</p>
                        </div>
                      </Card>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
