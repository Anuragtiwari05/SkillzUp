import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SkillzUp | Personalized Learning Roadmaps",
    template: "%s | SkillzUp",
  },
  description:
    "SkillzUp helps you master any skill with structured learning roadmaps, curated YouTube channels, expert articles, and an AI learning assistant — all in one place.",
  openGraph: {
    title: "SkillzUp | Personalized Learning Roadmaps",
    description:
      "Structured learning roadmaps, curated resources, and an AI assistant to accelerate your growth.",
    siteName: "SkillzUp",
    type: "website",
  },
};

// Runs before hydration so the correct theme paints immediately (no flash).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var pref = localStorage.getItem('themePreference') || 'system';
    var isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
