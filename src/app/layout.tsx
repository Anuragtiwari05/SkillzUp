import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import MotionProvider from "@/component/motion/MotionProvider";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} antialiased`}>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
