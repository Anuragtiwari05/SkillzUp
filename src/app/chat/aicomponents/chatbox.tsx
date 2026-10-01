"use client";

import { useEffect, useState, type RefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Sparkles, User, Copy, Check, Youtube, FileText, Newspaper } from "lucide-react";
import type { ChatResources, ResourceGroup } from "@/lib/resourceSearch";
import { recordView } from "@/lib/track";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  resources?: ChatResources | null;
}

interface ChatBoxProps {
  messages: Message[];
  loading: boolean;
  /** The scrollable messages container; we scroll THIS, never the window. */
  scrollRef: RefObject<HTMLDivElement | null>;
  onSuggest: (text: string) => void;
}

const SUGGESTIONS = [
  "Make me a React roadmap",
  "Show me Python videos",
  "Articles on system design",
  "Latest AI news",
];

const GROUP_META = {
  video: { label: "Videos", icon: Youtube, itemType: "video" as const },
  article: { label: "Articles", icon: FileText, itemType: "article" as const },
  news: { label: "News", icon: Newspaper, itemType: "news" as const },
};

function ResourceCards({ resources }: { resources: ChatResources }) {
  const [active, setActive] = useState(0);
  const group: ResourceGroup | undefined = resources.groups[active] ?? resources.groups[0];
  if (!group) return null;
  const meta = GROUP_META[group.type];

  return (
    <div className="mt-3 w-full">
      {resources.groups.length > 1 && (
        <div className="mb-3 flex gap-2">
          {resources.groups.map((g, i) => {
            const m = GROUP_META[g.type];
            return (
              <button
                key={g.type}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  i === active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:border-primary"
                }`}
              >
                <m.icon className="h-3.5 w-3.5" /> {m.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {group.items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordView(meta.itemType, item.url, item.title)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
          >
            <div className="h-28 w-full overflow-hidden bg-surface-elevated">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <meta.icon className="h-7 w-7" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-3">
              <p className="line-clamp-2 text-sm font-bold leading-snug">{item.title}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs">
                <span className="truncate font-semibold text-link">{item.source}</span>
                <span className="shrink-0 text-muted-foreground">{item.meta}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const MARKDOWN_CLASSES =
  "max-w-none " +
  "[&_p]:m-0 [&_p+p]:mt-2 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 " +
  "[&_li]:my-0.5 " +
  "[&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1 " +
  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 " +
  "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 " +
  "[&_a]:underline [&_a]:font-semibold [&_strong]:font-bold " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-3 [&_blockquote]:italic " +
  "[&_code]:bg-surface-elevated [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] " +
  "[&_pre]:bg-surface-elevated [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0";

function formatTime(timestamp?: string) {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — fail silently, not critical
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy response"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function ChatBox({ messages, loading, scrollRef, onSuggest }: ChatBoxProps) {
  // Scroll only the chat container to the newest message (not the whole page).
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, scrollRef]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="m-auto flex max-w-xl flex-col items-center py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary bg-primary/15 text-link">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-foreground">What do you want to learn?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask for a roadmap, videos, articles or the latest news on any topic.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggest(s)}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser ? "bg-primary text-primary-foreground" : "bg-primary/15 text-link border border-primary"
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={`flex flex-col min-w-0 ${msg.resources ? "w-full max-w-full" : "max-w-[85%] sm:max-w-[75%]"} ${isUser ? "items-end" : "items-start"}`}>
              <span className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">
                {isUser ? "You" : "SkillzUp AI"}
              </span>

              <div
                className={`px-4 py-3 rounded-2xl shadow-md text-sm md:text-base ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-primary/15 border border-primary text-link rounded-bl-sm"
                }`}
              >
                <div className={MARKDOWN_CLASSES}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {msg.resources && <ResourceCards resources={msg.resources} />}

              <div className="flex items-center gap-2 mt-1 px-1">
                {msg.timestamp && (
                  <span className="text-[11px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                )}
                {!isUser && <CopyButton content={msg.content} />}
              </div>
            </div>
          </motion.div>
        );
      })}

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-2"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/15 text-link border border-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-primary/15 border border-primary shadow-md">
            <span className="flex gap-1">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
