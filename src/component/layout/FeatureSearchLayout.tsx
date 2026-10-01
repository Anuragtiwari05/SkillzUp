import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import FloatingChatButton from "@/component/FloatingChatButton";

/**
 * Shared shell for /features/* pages. Server component: the breadcrumb, title and
 * description are in the initial HTML even before any client JS runs.
 */
export default function FeatureSearchLayout({
  eyebrow,
  title,
  description,
  icon,
  breadcrumb,
  children,
  below,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  breadcrumb: string;
  /** Interactive area (search bar, chips, results) rendered inside the hero. */
  children: ReactNode;
  /** Extra server-rendered content below the interactive area. */
  below?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-clip">
      <Navbar />

      <main className="flex-1">
        <section className="relative px-4 sm:px-6 pt-6 pb-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[440px] opacity-70"
            style={{
              background:
                "radial-gradient(55% 70% at 50% 0%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 72%), radial-gradient(30% 40% at 90% 10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-link transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                <li>
                  <Link href="/#features" className="hover:text-link transition-colors">
                    Features
                  </Link>
                </li>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                <li aria-current="page" className="font-semibold text-foreground">
                  {breadcrumb}
                </li>
              </ol>
            </nav>

            <header className="max-w-3xl mx-auto text-center mb-10">
              <span className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/15 border border-border text-link mb-5">
                {icon}
              </span>
              <p className="eyebrow text-link mb-3">{eyebrow}</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-[1.05] mb-4">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">{description}</p>
            </header>

            {children}
          </div>
        </section>

        {below}
      </main>

      <Footer />
      <FloatingChatButton />
    </div>
  );
}
