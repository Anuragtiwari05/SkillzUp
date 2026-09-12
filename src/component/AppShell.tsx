"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ArrowLeft,
  LayoutDashboard,
  Bookmark,
  MessageSquare,
  User,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/component/ui/Loader";
import BackButton from "@/component/ui/BackButton";

export type ActiveSection = "dashboard" | "bookmarks" | "chat-history" | "profile" | "settings";

const NAV_ITEMS: { key: ActiveSection; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "bookmarks", label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { key: "chat-history", label: "Chat History", href: "/chat-history", icon: MessageSquare },
  { key: "profile", label: "Profile / Activity", href: "/profile", icon: User },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ active, onNavigate }: { active: ActiveSection; onNavigate?: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/auth/login");
    } catch {}
  };

  return (
    <div className="flex flex-col h-full bg-ink text-white">
      <Link href="/" className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="bg-primary-500 p-1.5 rounded-lg">
          <BookOpen className="w-5 h-5 text-ink" />
        </div>
        <span className="text-lg font-heading font-bold">SkillzUp</span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-primary-500 text-ink"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AppShell({
  active,
  title,
  children,
}: {
  active: ActiveSection;
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      const redirect = NAV_ITEMS.find((i) => i.key === active)?.href ?? "/dashboard";
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [loading, isLoggedIn, router, active]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" label="Checking your session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent active={active} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 w-72 h-full z-50 md:hidden"
            >
              <SidebarContent active={active} onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-4 bg-ink text-white sticky top-0 z-30">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => router.back()} aria-label="Go back" className="hover:text-primary-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold truncate">{title}</span>
        </header>

        <main className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
          <BackButton className="hidden md:inline-flex mb-4" />
          <h1 className="hidden md:block text-2xl sm:text-3xl font-heading font-extrabold text-neutral-900 mb-6">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}
