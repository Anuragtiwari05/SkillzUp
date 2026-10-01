"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/component/theme/ThemeToggle";
import SkillzUpWord from "@/component/motion/SkillzUpWord";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="SkillzUp home">
      <span className="bg-primary text-primary-foreground p-1.5 rounded-full">
        <BookOpen className="w-5 h-5" />
      </span>
      <span className="text-lg font-heading font-extrabold text-foreground">
        <SkillzUpWord variant="nav" />
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { isLoggedIn, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/auth/login");
      router.refresh();
    } catch {}
  };

  const linkClass = (href: string) =>
    `font-semibold transition-colors hover:text-link ${
      pathname === href ? "text-foreground" : "text-muted-foreground"
    }`;

  const ctaClass =
    "bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/85 transition-colors duration-300 font-bold";

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
            )}
            <ThemeToggle />
            {loading ? (
              <span className="h-10 w-24 rounded-full bg-surface-elevated" aria-hidden />
            ) : isLoggedIn ? (
              <button onClick={handleLogout} className={ctaClass}>
                Logout
              </button>
            ) : (
              <Link href="/auth/login" className={ctaClass}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="text-foreground h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-surface-elevated transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-4 space-y-1 px-2"
            >
              {[...LINKS, ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : [])].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-foreground hover:text-link font-semibold py-2"
                >
                  {l.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <button onClick={handleLogout} className={`${ctaClass} w-full mt-2`}>
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" className={`block ${ctaClass} w-full mt-2 text-center`}>
                  Login
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
