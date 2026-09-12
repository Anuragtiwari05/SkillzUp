"use client";

import { useEffect, useState } from "react";
import { Search, Newspaper, ExternalLink } from "lucide-react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import BackButton from "@/component/ui/BackButton";
import Loader from "@/component/ui/Loader";
import Reveal from "@/component/ui/Reveal";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import BookmarkButton from "@/component/ui/BookmarkButton";
import { recordView } from "@/lib/track";

type Article = {
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  source?: { name: string; url?: string };
};

export default function ArticlesFeaturePage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/bookmarks", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSavedUrls(new Set(data.bookmarks.map((b: any) => b.sourceUrl)));
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setArticles([]);

    try {
      const res = await fetch(`/api/features/article?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch articles");

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setArticles(
          data.items.map((item: any) => ({
            id: item.id || item._id || Math.random().toString(),
            title: item.title || "No title",
            description: item.description || item.content || "No description",
            image: item.image || item.urlToImage || "",
            url: item.url || "#",
            source: item.source
              ? typeof item.source === "string"
                ? { name: item.source }
                : { name: item.source.name || "Unknown", url: item.source.url }
              : { name: "Unknown" },
          }))
        );
      } else {
        setError("No articles found for this search.");
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
          <p className="eyebrow text-primary-600 mb-3">Expert Articles</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-4 sm:mb-6">
            Discover the Latest Articles
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-10 font-medium">
            Search trending tech, AI, and programming articles.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center bg-surface shadow-md hover:shadow-lg rounded-2xl border-2 border-surface-border focus-within:border-primary-400 px-4 sm:px-6 py-3 sm:py-4 w-full transition mx-auto gap-2 sm:gap-3">
            <Newspaper className="w-5 sm:w-6 h-5 sm:h-6 text-primary-600 hidden sm:block" />
            <input
              type="text"
              placeholder="Search for tech or learning articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 outline-none text-neutral-900 placeholder-neutral-400 text-base sm:text-lg font-medium rounded-lg sm:rounded-none w-full sm:w-auto"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="w-4 sm:w-5 h-4 sm:h-5" /> Search
            </Button>
          </form>
        </Reveal>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          {loading && <Loader size="lg" label="Fetching latest articles..." />}

          {error && (
            <div className="text-center py-32">
              <p className="text-2xl font-bold text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Newspaper className="w-12 sm:w-16 h-12 sm:h-16 text-primary-600 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900 mb-2">Explore Articles</h2>
              <p className="text-base sm:text-lg text-neutral-600">Search for the latest tech, coding, and AI articles.</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {articles.map((art, idx) => (
                <Reveal key={art.id} delay={Math.min(idx * 0.05, 0.3)}>
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    onClick={() => recordView("article", art.url, art.title)}
                  >
                    <Card className="group overflow-hidden">
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-primary-50">
                        {art.image ? (
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary-300">
                            <Newspaper className="w-8 sm:w-10 h-8 sm:h-10" />
                          </div>
                        )}
                        <BookmarkButton
                          className="absolute top-2 right-2"
                          itemType="article"
                          sourceUrl={art.url}
                          title={art.title}
                          thumbnailUrl={art.image}
                          saved={savedUrls.has(art.url)}
                          onChange={(saved) =>
                            setSavedUrls((prev) => {
                              const next = new Set(prev);
                              saved ? next.add(art.url) : next.delete(art.url);
                              return next;
                            })
                          }
                        />
                      </div>
                      <div className="p-3 sm:p-5 flex flex-col justify-between min-h-[180px]">
                        <h3 className="font-bold text-neutral-900 text-base sm:text-lg line-clamp-2 mb-2">{art.title}</h3>
                        <p className="text-neutral-600 text-sm sm:text-base font-medium line-clamp-3 mb-3">{art.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm sm:text-base font-semibold text-primary-700 truncate">{art.source?.name}</p>
                          <ExternalLink className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                    </Card>
                  </a>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
